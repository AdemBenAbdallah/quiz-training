/**
 * DodoPayments Configuration and Utilities
 *
 * This file centralizes all DodoPayments-related configuration and provides
 * utilities for handling product IDs, bundle configurations, and payment processing.
 */

import { BundleType } from "@/lib/utils/payment";

// ===============================================
// ENVIRONMENT VARIABLES
// ===============================================

// DodoPayments Product IDs from dashboard
export const DODO_PRODUCT_IDS = {
  INDIVIDUAL: process.env.NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL,
  PROFESSIONAL: process.env.NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL,
  COMPLETE: process.env.NEXT_PUBLIC_DODO_PRODUCT_COMPLETE,
} as const;

// ===============================================
// TYPES
// ===============================================

export interface DodoProductConfig {
  productId: string;
  bundleType: BundleType;
  price: number;
  certificateCount: number;
  displayName: string;
  description: string;
}

export interface CheckoutData {
  product_cart: Array<{
    product_id: string;
    quantity: number;
  }>;
  billing: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  };
  customer: {
    email: string;
    name: string;
  };
  referenceId: string;
  metadata: {
    bundleType: string;
    certificateCount: string;
    selectedCertificates?: string[];
  };
}

export interface WebhookProductMapping {
  productId: string;
  bundleType: BundleType;
  certificateCount: number;
}

// ===============================================
// PRODUCT CONFIGURATIONS
// ===============================================

/**
 * Complete product configuration for all DodoPayments products
 */
export const DODO_PRODUCT_CONFIGS: Record<BundleType, DodoProductConfig> = {
  individual: {
    productId: DODO_PRODUCT_IDS.INDIVIDUAL || "",
    bundleType: "individual",
    price: 9.99,
    certificateCount: 1,
    displayName: "Individual Certification",
    description: "1 certification course",
  },
  professional: {
    productId: DODO_PRODUCT_IDS.PROFESSIONAL || "",
    bundleType: "professional",
    price: 24.99,
    certificateCount: 3,
    displayName: "Professional Bundle",
    description: "3 certification courses",
  },
  complete: {
    productId: DODO_PRODUCT_IDS.COMPLETE || "",
    bundleType: "complete",
    price: 49.99,
    certificateCount: 11,
    displayName: "Complete Bundle",
    description: "All 11 certification courses",
  },
} as const;

// ===============================================
// VALIDATION FUNCTIONS
// ===============================================

/**
 * Validate that all required environment variables are set
 */
export function validateDodoPaymentsConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL) {
    errors.push("NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL is not set");
  }
  if (!process.env.NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL) {
    errors.push("NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL is not set");
  }
  if (!process.env.NEXT_PUBLIC_DODO_PRODUCT_COMPLETE) {
    errors.push("NEXT_PUBLIC_DODO_PRODUCT_COMPLETE is not set");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a product ID is valid for a given bundle type
 */
export function isValidProductId(productId: string, bundleType: BundleType): boolean {
  const config = DODO_PRODUCT_CONFIGS[bundleType];
  return config.productId === productId;
}

// ===============================================
// MAPPING FUNCTIONS
// ===============================================

/**
 * Get product configuration by bundle type
 */
export function getProductConfig(bundleType: BundleType): DodoProductConfig {
  const config = DODO_PRODUCT_CONFIGS[bundleType];
  if (!config.productId) {
    throw new Error(`Product ID not configured for ${bundleType} bundle`);
  }
  return config;
}

/**
 * Get bundle type by product ID
 */
export function getBundleTypeByProductId(productId: string): BundleType | null {
  for (const [bundleType, config] of Object.entries(DODO_PRODUCT_CONFIGS)) {
    if (config.productId === productId) {
      return bundleType as BundleType;
    }
  }
  return null;
}

/**
 * Map product ID to bundle information for webhook processing
 */
export function getBundleInfoByProductId(productId: string): WebhookProductMapping | null {
  for (const [bundleType, config] of Object.entries(DODO_PRODUCT_CONFIGS)) {
    if (config.productId === productId) {
      return {
        productId,
        bundleType: bundleType as BundleType,
        certificateCount: config.certificateCount,
      };
    }
  }
  return null;
}

// ===============================================
// CHECKOUT DATA CREATION
// ===============================================

/**
 * Create checkout data for a specific bundle type
 */
export function createCheckoutData(
  bundleType: BundleType,
  billingInfo: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  },
  customer: {
    email: string;
    name: string;
  },
  referenceId: string,
  selectedCertificates?: string[]
): CheckoutData {
  const config = getProductConfig(bundleType);

  return {
    product_cart: [
      {
        product_id: config.productId,
        quantity: 1,
      },
    ],
    billing: billingInfo,
    customer,
    referenceId,
    metadata: {
      bundleType,
      certificateCount: config.certificateCount.toString(),
      ...(selectedCertificates && selectedCertificates.length > 0 && {
        selectedCertificates,
      }),
    },
  };
}

/**
 * Create checkout data for all plans (for UI display)
 */
export function getAllCheckoutData(
  billingInfo: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  },
  customer: {
    email: string;
    name: string;
  },
  referenceId: string
): Record<BundleType, CheckoutData> {
  const result: Record<BundleType, CheckoutData> = {} as Record<BundleType, CheckoutData>;

  for (const bundleType of Object.keys(DODO_PRODUCT_CONFIGS) as BundleType[]) {
    result[bundleType] = createCheckoutData(
      bundleType,
      billingInfo,
      customer,
      referenceId
    );
  }

  return result;
}

// ===============================================
// WEBHOOK PROCESSING HELPERS
// ===============================================

/**
 * Process webhook payload to extract payment information
 */
export function processWebhookPayload(payload: any): {
  userId?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  productId?: string;
  bundleType?: BundleType;
  certificateCount?: number;
  selectedCertificates?: string[];
  event?: string;
} {
  const event = payload?.type || payload?.event_type || payload?.event;
  const data = payload?.data || {};

  // User ID passed during checkout as referenceId
  const userId: string | undefined = data?.metadata?.referenceId;

  // Payment details
  const paymentId: string | undefined = data?.payment_id || data?.id;
  const amount: number = data?.total_amount ?? data?.settlement_amount ?? 0;
  const currency: string = data?.settlement_currency ?? data?.currency ?? "USD";

  // Product details from product_cart
  const productCart = data?.product_cart || [];
  const firstProduct = productCart[0];
  const productId: string | undefined = firstProduct?.product_id;

  // Get bundle information
  const bundleInfo = productId ? getBundleInfoByProductId(productId) : null;
  const bundleType: BundleType | undefined = bundleInfo?.bundleType;
  const certificateCount: number | undefined = bundleInfo?.certificateCount;

  // Selected certificates for professional bundle
  const selectedCertificates = data?.metadata?.selectedCertificates
    ? JSON.parse(data.metadata.selectedCertificates)
    : [];

  return {
    userId,
    paymentId,
    amount,
    currency,
    productId,
    bundleType,
    certificateCount,
    selectedCertificates,
    event,
  };
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

/**
 * Get product display name
 */
export function getProductDisplayName(bundleType: BundleType): string {
  return DODO_PRODUCT_CONFIGS[bundleType].displayName;
}

/**
 * Check if all products are configured
 */
export function areAllProductsConfigured(): boolean {
  const validation = validateDodoPaymentsConfig();
  return validation.valid;
}

/**
 * Get configuration status for debugging
 */
export function getConfigStatus(): {
  configured: boolean;
  missingProducts: string[];
  allConfigs: typeof DODO_PRODUCT_CONFIGS;
} {
  const validation = validateDodoPaymentsConfig();
  const missingProducts: string[] = [];

  for (const [bundleType, config] of Object.entries(DODO_PRODUCT_CONFIGS)) {
    if (!config.productId) {
      missingProducts.push(bundleType);
    }
  }

  return {
    configured: validation.valid,
    missingProducts,
    allConfigs: DODO_PRODUCT_CONFIGS,
  };
}

// ===============================================
// DEFAULT EXPORTS
// ===============================================

export default {
  DODO_PRODUCT_CONFIGS,
  DODO_PRODUCT_IDS,
  validateDodoPaymentsConfig,
  getProductConfig,
  getBundleTypeByProductId,
  getBundleInfoByProductId,
  createCheckoutData,
  getAllCheckoutData,
  processWebhookPayload,
  formatPrice,
  getProductDisplayName,
  areAllProductsConfigured,
  getConfigStatus,
};
