#!/usr/bin/env node

/**
 * DodoPayments Configuration Validation Script
 *
 * This script validates that all required environment variables and configurations
 * are properly set up for the DodoPayments integration.
 *
 * Usage:
 *   npm run validate:dodopayments
 *   npx tsx scripts/validate-dodopayments-config.ts
 *   node scripts/validate-dodopayments-config.ts
 */

import { config } from 'dotenv';
import {
    areAllProductsConfigured,
    getConfigStatus,
    validateDodoPaymentsConfig
} from '../lib/dodopayments-config';

// Load environment variables
config();

// ===============================================
// VALIDATION FUNCTIONS
// ===============================================

/**
 * Validate environment variables format and presence
 */
function validateEnvironmentVariables(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required environment variables
  const requiredVars = [
    'DODO_PAYMENTS_API_KEY',
    'DODO_PAYMENTS_WEBHOOK_SECRET',
    'NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL',
    'NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL',
    'NEXT_PUBLIC_DODO_PRODUCT_COMPLETE',
    'BETTER_AUTH_URL',
  ];

  // Optional but recommended
  const optionalVars = [
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GEMINI_API_KEY',
    'REDIS_URL',
    'RESEND_API_KEY',
  ];

  // Check required variables
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    } else if (process.env[varName] === 'your_' + varName.toLowerCase() + '_here' ||
               process.env[varName] === 'your_dodopayments_api_key_here' ||
               process.env[varName] === 'your_webhook_secret_here') {
      errors.push(`Environment variable ${varName} contains placeholder value`);
    }
  });

  // Check optional variables
  optionalVars.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(`Missing optional environment variable: ${varName}`);
    }
  });

  // Validate product ID formats
  const productVars = [
    'NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL',
    'NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL',
    'NEXT_PUBLIC_DODO_PRODUCT_COMPLETE',
  ];

  productVars.forEach((varName) => {
    const value = process.env[varName];
    if (value && !value.startsWith('prod_')) {
      warnings.push(`${varName} doesn't match expected format (should start with 'prod_')`);
    }
  });

  // Validate API key format
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (apiKey && !apiKey.startsWith('sk_')) {
    warnings.push('DODO_PAYMENTS_API_KEY doesn\'t match expected format (should start with "sk_")');
  }

  // Validate webhook secret format
  const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
  if (webhookSecret && webhookSecret.length < 32) {
    warnings.push('DODO_PAYMENTS_WEBHOOK_SECRET seems too short (should be at least 32 characters)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Test the DodoPayments configuration utility
 */
function testConfigurationUtility(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Test validation function
    const validation = validateDodoPaymentsConfig();
    if (!validation.valid) {
      errors.push(...validation.errors);
    }

    // Test configuration status
    const status = getConfigStatus();
    if (status.missingProducts.length > 0) {
      warnings.push(`Missing product configurations: ${status.missingProducts.join(', ')}`);
    }

    // Test if all products are configured
    if (!areAllProductsConfigured()) {
      errors.push('Not all products are properly configured');
    }

  } catch (error) {
    errors.push(`Configuration utility test failed: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate webhook endpoint configuration
 */
function validateWebhookConfiguration(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const betterAuthUrl = process.env.BETTER_AUTH_URL;
  if (!betterAuthUrl) {
    errors.push('BETTER_AUTH_URL is required for webhook endpoint');
    return { valid: false, errors, warnings };
  }

  const webhookEndpoint = `${betterAuthUrl}/api/auth/dodopayments/webhook`;

  // Check if URL looks valid
  try {
    new URL(webhookEndpoint);
  } catch {
    errors.push(`Invalid BETTER_AUTH_URL format: ${betterAuthUrl}`);
  }

  warnings.push(`Webhook endpoint should be configured in DodoPayments dashboard: ${webhookEndpoint}`);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Display validation results
 */
function displayResults(results: {
  environment: ReturnType<typeof validateEnvironmentVariables>;
  utility: ReturnType<typeof testConfigurationUtility>;
  webhook: ReturnType<typeof validateWebhookConfiguration>;
}) {
  console.log('\n🔍 DodoPayments Configuration Validation\n');
  console.log('=' .repeat(50));

  const allValid = results.environment.valid &&
                  results.utility.valid &&
                  results.webhook.valid;

  if (allValid) {
    console.log('✅ All validations passed!');
  } else {
    console.log('❌ Validation failed - please fix the errors below\n');
  }

  // Environment Variables
  console.log('\n📋 Environment Variables:');
  if (results.environment.errors.length === 0) {
    console.log('  ✅ All required environment variables are set');
  } else {
    console.log('  ❌ Errors:');
    results.environment.errors.forEach(error => console.log(`     - ${error}`));
  }

  if (results.environment.warnings.length > 0) {
    console.log('  ⚠️  Warnings:');
    results.environment.warnings.forEach(warning => console.log(`     - ${warning}`));
  }

  // Configuration Utility
  console.log('\n⚙️  Configuration Utility:');
  if (results.utility.errors.length === 0) {
    console.log('  ✅ Configuration utility is working correctly');
  } else {
    console.log('  ❌ Errors:');
    results.utility.errors.forEach(error => console.log(`     - ${error}`));
  }

  if (results.utility.warnings.length > 0) {
    console.log('  ⚠️  Warnings:');
    results.utility.warnings.forEach(warning => console.log(`     - ${warning}`));
  }

  // Webhook Configuration
  console.log('\n🔗 Webhook Configuration:');
  if (results.webhook.errors.length === 0) {
    console.log('  ✅ Webhook configuration looks good');
  } else {
    console.log('  ❌ Errors:');
    results.webhook.errors.forEach(error => console.log(`     - ${error}`));
  }

  if (results.webhook.warnings.length > 0) {
    console.log('  ⚠️  Warnings:');
    results.webhook.warnings.forEach(warning => console.log(`     - ${warning}`));
  }

  // Configuration Details
  console.log('\n📊 Configuration Details:');
  try {
    const status = getConfigStatus();
    console.log(`  Products Configured: ${status.configured ? 'Yes' : 'No'}`);
    if (status.missingProducts.length > 0) {
      console.log(`  Missing Products: ${status.missingProducts.join(', ')}`);
    }

    console.log('\n  Product Configurations:');
    Object.entries(status.allConfigs).forEach(([bundleType, config]) => {
      const statusIcon = config.productId ? '✅' : '❌';
      console.log(`    ${statusIcon} ${bundleType}: ${config.displayName} (${config.certificateCount} certs, $${config.price})`);
      if (config.productId) {
        console.log(`        Product ID: ${config.productId}`);
      }
    });
  } catch (error) {
    console.log(`  ❌ Error getting configuration details: ${error}`);
  }

  // Next Steps
  console.log('\n📝 Next Steps:');
  if (allValid) {
    console.log('  ✅ Configuration is complete! You can now:');
    console.log('     1. Test the payment flows in development');
    console.log('     2. Set up webhooks in DodoPayments dashboard');
    console.log('     3. Deploy to production');
    console.log('     4. Monitor payment processing');
  } else {
    console.log('  🔧 Please fix the errors above and then:');
    console.log('     1. Create products in DodoPayments dashboard');
    console.log('     2. Update environment variables with product IDs');
    console.log('     3. Run this script again to verify');
  }

  console.log('\n' + '=' .repeat(50) + '\n');

  return allValid;
}

// ===============================================
// MAIN EXECUTION
// ===============================================

/**
 * Main validation function
 */
async function validateConfiguration(): Promise<boolean> {
  console.log('Starting DodoPayments configuration validation...\n');

  // Run all validations
  const results = {
    environment: validateEnvironmentVariables(),
    utility: testConfigurationUtility(),
    webhook: validateWebhookConfiguration(),
  };

  // Display results
  const allValid = displayResults(results);

  // Exit with appropriate code
  process.exit(allValid ? 0 : 1);
}

/**
 * Export for programmatic use
 */
export async function validateDodoPaymentsConfiguration(): Promise<{
  valid: boolean;
  results: {
    environment: ReturnType<typeof validateEnvironmentVariables>;
    utility: ReturnType<typeof testConfigurationUtility>;
    webhook: ReturnType<typeof validateWebhookConfiguration>;
  };
}> {
  const results = {
    environment: validateEnvironmentVariables(),
    utility: testConfigurationUtility(),
    webhook: validateWebhookConfiguration(),
  };

  const valid = results.environment.valid &&
                results.utility.valid &&
                results.webhook.valid;

  return { valid, results };
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateConfiguration().catch((error) => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

export default validateDodoPaymentsConfiguration;
