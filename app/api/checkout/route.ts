import { authClient } from "@/lib/auth-client";
import {
    createCheckoutData,
    getProductConfig,
    validateDodoPaymentsConfig,
} from "@/lib/dodopayments-config";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for checkout requests
const checkoutRequestSchema = z.object({
  bundleType: z.enum(["individual", "professional", "complete"]),
  selectedCertificates: z.array(z.string()).optional(),
});

// POST /api/checkout
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await authClient.getSession();
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = checkoutRequestSchema.parse(body);

    // Validate DodoPayments configuration
    const configValidation = validateDodoPaymentsConfig();
    if (!configValidation.valid) {
      console.error(
        "DodoPayments configuration errors:",
        configValidation.errors
      );
      return NextResponse.json(
        { error: "Payment system configuration error" },
        { status: 500 }
      );
    }

    // Validate bundle type specific requirements
    if (validatedData.bundleType === "professional") {
      if (!validatedData.selectedCertificates || validatedData.selectedCertificates.length !== 3) {
        return NextResponse.json(
          { error: "Professional bundle requires exactly 3 certificates" },
          { status: 400 }
        );
      }
    }

    // Get billing information
    const billingInfo = await getBillingInfo();

    // Get product configuration
    const productConfig = getProductConfig(validatedData.bundleType);

    // Create checkout data
    const checkoutData = createCheckoutData(
      validatedData.bundleType,
      billingInfo,
      {
        email: session.user.email,
        name: session.user.name || session.user.email,
      },
      session.user.id,
      validatedData.selectedCertificates
    );

    // Create checkout session with DodoPayments
    const { data: checkout, error } = await authClient.dodopayments.checkout(
      checkoutData
    );

    if (error) {
      console.error("DodoPayments checkout error:", error);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    if (!checkout?.url) {
      return NextResponse.json(
        { error: "No checkout URL returned" },
        { status: 500 }
      );
    }

    // Return success response with checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.url,
      sessionId: checkout.session_id,
      product: {
        bundleType: validatedData.bundleType,
        productId: productConfig.productId,
        price: productConfig.price,
        certificateCount: productConfig.certificateCount,
      },
      metadata: {
        referenceId: session.user.id,
        bundleType: validatedData.bundleType,
        certificateCount: productConfig.certificateCount.toString(),
        ...(validatedData.selectedCertificates && {
          selectedCertificates: validatedData.selectedCertificates,
        }),
      },
    });
  } catch (error) {
    console.error("Checkout API error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/checkout
export async function GET(request: NextRequest) {
  try {
    const session = await authClient.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate DodoPayments configuration for health check
    const configValidation = validateDodoPaymentsConfig();
    const isConfigured = configValidation.valid;

    // Get product configurations
    const products = {
      individual: getProductConfig("individual"),
      professional: getProductConfig("professional"),
      complete: getProductConfig("complete"),
    };

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      configurationErrors: configValidation.errors,
      products: Object.entries(products).map(([bundleType, config]) => ({
        bundleType,
        productId: config.productId,
        price: config.price,
        certificateCount: config.certificateCount,
        displayName: config.displayName,
        description: config.description,
        isConfigured: !!config.productId,
      })),
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    console.error("Checkout health check error:", error);
    return NextResponse.json(
      { error: "Failed to check configuration" },
      { status: 500 }
    );
  }
}
