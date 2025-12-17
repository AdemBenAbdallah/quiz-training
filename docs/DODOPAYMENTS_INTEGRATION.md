# DodoPayments Integration Guide

## Overview

This guide covers the complete integration of DodoPayments for handling subscription and one-time payments in your AWS Quiz Training application. The integration has been updated to use DodoPayments product IDs instead of slugs for better compatibility and reliability.

## Prerequisites

- DodoPayments account with API access
- Products created in DodoPayments dashboard
- Webhook endpoint configured
- Environment variables set up

## Dashboard Setup

### 1. Create Products in DodoPayments Dashboard

Navigate to your DodoPayments dashboard and create the following products:

#### Individual Plan
```json
{
  "name": "Individual Certification",
  "description": "1 certification course with lifetime access",
  "price": {
    "type": "one_time",
    "unit_amount": 999,
    "currency": "USD"
  }
}
```

#### Professional Plan
```json
{
  "name": "Professional Bundle", 
  "description": "3 certification courses with lifetime access",
  "price": {
    "type": "one_time",
    "unit_amount": 2499,
    "currency": "USD"
  }
}
```

#### Complete Plan
```json
{
  "name": "Complete Bundle",
  "description": "All 11 AWS certification courses with lifetime access", 
  "price": {
    "type": "one_time",
    "unit_amount": 4999,
    "currency": "USD"
  }
}
```

### 2. Get Product IDs

After creating products, copy their IDs (format: `prod_xxxxxxxx`). You'll need these for your environment variables.

### 3. Configure Webhook

Set up a webhook in your DodoPayments dashboard pointing to:
```
https://yourdomain.com/api/auth/dodopayments/webhook
```

Select these events:
- `payment.succeeded`
- `payment.failed`
- `payment.refunded`

## Environment Variables

Add these to your `.env` file:

```bash
# DodoPayments Configuration
DODO_PAYMENTS_API_KEY=your_dodopayments_api_key_here
DODO_PAYMENTS_WEBHOOK_SECRET=your_webhook_secret_here

# Product IDs from DodoPayments dashboard
NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL=prod_individual_123456
NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL=prod_professional_789012  
NEXT_PUBLIC_DODO_PRODUCT_COMPLETE=prod_complete_345678

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000

# Other required variables
DATABASE_URL=postgresql://username:password@localhost:5432/quiz_training
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=your_resend_api_key
```

## Code Changes Made

### 1. New Configuration Utility

Created `/lib/dodopayments-config.ts` which provides:
- Product ID management
- Bundle configuration
- Checkout data creation
- Webhook payload processing
- Validation utilities

### 2. Updated Components

#### PaymentModal.tsx
- Updated to use `createCheckoutData()` utility
- Added configuration validation
- Improved error handling
- Uses product IDs instead of slugs

#### Pricing.tsx  
- Updated checkout logic to use product mapping
- Added proper error handling for missing product IDs
- Maintains certificate selection for professional bundles

#### Auth Configuration (auth.ts)
- Updated Better Auth configuration with multiple products
- Enhanced webhook processing to handle product IDs
- Improved bundle type detection

### 3. New API Endpoint

Created `/api/checkout` endpoint that:
- Validates requests with Zod schema
- Handles authentication
- Creates checkout sessions
- Provides health check functionality

## Webhook Processing

The webhook handler processes payments and updates user records:

```typescript
// Key webhook logic
const bundleInfo = productId ? getBundleInfoByProductId(productId) : null;
const planType = bundleInfo?.bundleType || "individual";

await db.insert(userPayment).values({
  id: crypto.randomUUID(),
  userId,
  certificateId,
  paymentId,
  status: "completed", 
  amount,
  currency,
  productSlug,
  bundleType: planType,
  certificateCount: bundleInfo?.certificateCount || 1,
  purchasedCertificates: purchasedCertificates.length > 0 
    ? JSON.stringify(purchasedCertificates) 
    : null,
});
```

## Testing

### 1. Development Testing

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Test checkout endpoints
curl -X GET http://localhost:3000/api/checkout
```

### 2. Webhook Testing

Use the DodoPayments dashboard to:
1. Create test payments
2. Send test webhooks
3. Verify payment records in database

### 3. Product Configuration Testing

Verify all products are configured:
```typescript
import { validateDodoPaymentsConfig } from '@/lib/dodopayments-config';

const validation = validateDodoPaymentsConfig();
console.log('Configured:', validation.valid);
console.log('Errors:', validation.errors);
```

## User Flow

### Individual Plan Purchase
1. User clicks "Start" on payment modal
2. System validates configuration
3. Creates checkout session with product ID
4. User redirected to DodoPayments checkout
5. Payment processed
6. Webhook updates user payment status
7. User gains access to certification

### Professional Plan Purchase  
1. User selects "Go Professional"
2. Certificate selection modal appears
3. User selects exactly 3 certificates
4. Checkout with product ID and selected certificates
5. Payment processing
6. Webhook updates with bundle and certificates
7. User gains access to selected certifications

### Complete Plan Purchase
1. User clicks "Get Everything"  
2. Checkout with complete bundle product ID
3. Payment processing
4. Webhook grants access to all certifications

## Database Schema

The `userPayment` table stores:
- `bundleType`: "individual", "professional", or "complete"
- `certificateCount`: Number of certificates (1, 3, or 11)
- `purchasedCertificates`: JSON array of certificate IDs
- `productSlug`: Original product identifier
- `paymentId`: DodoPayments payment ID

## Error Handling

### Configuration Errors
```typescript
const validation = validateDodoPaymentsConfig();
if (!validation.valid) {
  console.error('Missing environment variables:', validation.errors);
  // Show user-friendly error
}
```

### Checkout Errors
```typescript
if (error) {
  console.error('Checkout error:', error);
  alert('Payment failed. Please try again.');
  return;
}
```

### Webhook Errors
```typescript
try {
  // Process webhook
} catch (error) {
  console.error('Webhook processing error:', error);
  // Log for debugging but don't fail webhook
}
```

## Troubleshooting

### Common Issues

#### 1. Product IDs Not Working
- Verify products exist in DodoPayments dashboard
- Check environment variables are correctly named
- Ensure `NEXT_PUBLIC_` prefix for client-side access

#### 2. Webhooks Not Processing
- Verify webhook URL is accessible
- Check webhook secret matches environment variable
- Review webhook logs in DodoPayments dashboard

#### 3. Checkout Sessions Failing
- Test API key permissions in dashboard
- Verify product IDs are valid
- Check billing information collection

#### 4. Payment Status Not Updating
- Review webhook processing logs
- Check database connection
- Verify user ID mapping in metadata

### Debug Commands

```bash
# Check configuration
curl -X GET http://localhost:3000/api/checkout

# Validate environment
node -e "console.log(process.env.NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL)"

# Test webhook endpoint
curl -X POST http://localhost:3000/api/auth/dodopayments/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Logging

Enhanced logging throughout the integration:

```typescript
console.log("Received webhook (normalized):", {
  event,
  userId, 
  paymentId,
  amount,
  currency,
  productId,
  productSlug,
});
```

## Migration from Slugs

If migrating from slug-based system:

1. Create new products in DodoPayments dashboard
2. Update environment variables with product IDs
3. Deploy code changes
4. Test each payment flow
5. Monitor webhook processing
6. Verify user access permissions

## Security Considerations

- All environment variables are server-side except product IDs
- Webhook signatures are verified using webhook secret
- User payment data is stored securely in database
- No sensitive payment information stored locally

## Support

For issues with:
- DodoPayments integration: Check logs and webhook dashboard
- Product configuration: Verify dashboard setup
- Code issues: Review error logs and validation
- Database problems: Check connection and schema

## Next Steps

1. Set up products in DodoPayments dashboard
2. Configure environment variables
3. Test payment flows
4. Monitor webhook processing
5. Deploy to production
6. Set up monitoring and alerts
