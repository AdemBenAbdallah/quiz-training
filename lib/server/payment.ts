import { db } from "@/db";
import { certificates, userPayment } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

// Amount formatting utilities
export function formatPaymentAmount(amount: number | null): string {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${amount.toFixed(2)}`;
}

export function formatPaymentAmountFromCents(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

// Bundle configuration
export const BUNDLE_CONFIGS = {
  individual: {
    bundleType: "individual",
    price: 9.99,
    certificateCount: 1,
    description: "1 certification",
  },
  professional: {
    bundleType: "professional",
    price: 24.99,
    certificateCount: 3,
    description: "3 certifications",
  },
  complete: {
    bundleType: "complete",
    price: 49.99,
    certificateCount: 11,
    description: "All 11 certifications",
  },
} as const;

export type BundleType = keyof typeof BUNDLE_CONFIGS;

// Get user's bundle information
export async function getUserBundleInfo(userId: string) {
  try {
    const userPayments = await db
      .select()
      .from(userPayment)
      .where(
        and(
          eq(userPayment.userId, userId),
          eq(userPayment.status, "completed"),
        ),
      )
      .orderBy(userPayment.createdAt);

    if (userPayments.length === 0) {
      return {
        hasPayment: false,
        bundleType: null,
        certificateCount: 0,
        purchasedCertificates: [],
      };
    }

    // Get the most recent payment (highest certificate count wins)
    const sortedPayments = userPayments.sort((a, b) => {
      const aCount = a.certificateCount || 1;
      const bCount = b.certificateCount || 1;
      return bCount - aCount;
    });

    const latestPayment = sortedPayments[0];

    return {
      hasPayment: true,
      bundleType: (latestPayment.bundleType as BundleType) || null,
      certificateCount: latestPayment.certificateCount || 1,
      purchasedCertificates: latestPayment.purchasedCertificates
        ? JSON.parse(latestPayment.purchasedCertificates)
        : latestPayment.certificateId
          ? [latestPayment.certificateId]
          : [],
    };
  } catch (error) {
    console.error("Error getting user bundle info:", error);
    return {
      hasPayment: false,
      bundleType: null,
      certificateCount: 0,
      purchasedCertificates: [],
    };
  }
}

// Check if user has access to a specific certificate
export async function hasActivePurchase(
  userId: string,
  certificateId?: string,
): Promise<boolean> {
  try {
    if (!certificateId) {
      // Check if user has any active purchase
      const bundleInfo = await getUserBundleInfo(userId);
      return bundleInfo.hasPayment;
    }

    const bundleInfo = await getUserBundleInfo(userId);

    if (!bundleInfo.hasPayment) {
      return false;
    }

    // Complete bundle has access to all certificates
    if (bundleInfo.bundleType === "complete") {
      return true;
    }

    // Check if certificate is in user's purchased certificates
    return bundleInfo.purchasedCertificates?.includes(certificateId) || false;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
}

// Get user payment status with enhanced bundle information
export async function getUserPaymentStatus(
  userId: string,
  certificateId?: string,
) {
  try {
    const bundleInfo = await getUserBundleInfo(userId);

    const whereClause = certificateId
      ? and(
          eq(userPayment.userId, userId),
          eq(userPayment.certificateId, certificateId),
        )
      : eq(userPayment.userId, userId);

    const payments = await db
      .select()
      .from(userPayment)
      .where(whereClause)
      .orderBy(userPayment.createdAt);

    return {
      hasPayment: bundleInfo.hasPayment,
      bundleType: bundleInfo.bundleType,
      certificateCount: bundleInfo.certificateCount,
      purchasedCertificates: bundleInfo.purchasedCertificates,
      payments: payments.map((p) => ({
        id: p.id,
        paymentId: p.paymentId,
        status: p.status,
        amount: p.amount,
        formattedAmount: formatPaymentAmount(p.amount),
        currency: p.currency,
        certificateId: p.certificateId,
        bundleType: p.bundleType as BundleType | null,
        certificateCount: p.certificateCount || 0,
        purchasedCertificates: p.purchasedCertificates,
        createdAt: p.createdAt,
      })),
      isActive: bundleInfo.hasPayment,
      canAccessCertificate: certificateId
        ? await hasActivePurchase(userId, certificateId)
        : false,
    };
  } catch (error) {
    console.error("Error getting payment status:", error);
    return {
      hasPayment: false,
      bundleType: null,
      certificateCount: 0,
      purchasedCertificates: [],
      payments: [],
      isActive: false,
      canAccessCertificate: false,
    };
  }
}

// Get all certificates user has access to
export async function getUserAccessibleCertificates(userId: string) {
  try {
    const bundleInfo = await getUserBundleInfo(userId);

    if (!bundleInfo.hasPayment) {
      return [];
    }

    // If complete bundle, return all certificates
    if (bundleInfo.bundleType === "complete") {
      const allCerts = await db
        .select()
        .from(certificates)
        .where(eq(certificates.isActive, true));

      return allCerts.map((cert) => cert.id);
    }

    // Return user's specific purchased certificates
    return bundleInfo.purchasedCertificates || [];
  } catch (error) {
    console.error("Error getting accessible certificates:", error);
    return [];
  }
}

// Check if user can access a certificate based on their bundle
export async function canAccessCertificate(
  userId: string,
  certificateId: string,
): Promise<boolean> {
  return hasActivePurchase(userId, certificateId);
}

// Get bundle information for display
export function getBundleDisplayInfo(bundleType: BundleType | null) {
  if (!bundleType || !BUNDLE_CONFIGS[bundleType as BundleType]) {
    return {
      name: "Free",
      price: 0,
      description: "Limited access",
    };
  }

  const config = BUNDLE_CONFIGS[bundleType as BundleType];
  return {
    name: bundleType.charAt(0).toUpperCase() + bundleType.slice(1),
    price: config.price,
    description: config.description,
  };
}

// Validate certificate selection for professional bundle
export async function validateProfessionalBundleSelection(
  selectedCertificateIds: string[],
): Promise<{ valid: boolean; error?: string }> {
  if (
    selectedCertificateIds.length !==
    BUNDLE_CONFIGS.professional.certificateCount
  ) {
    return {
      valid: false,
      error: `Please select exactly ${BUNDLE_CONFIGS.professional.certificateCount} certifications`,
    };
  }

  // Check if all selected certificates exist and are active
  const activeCerts = await db
    .select()
    .from(certificates)
    .where(
      and(
        inArray(certificates.id, selectedCertificateIds),
        eq(certificates.isActive, true),
      ),
    );

  if (activeCerts.length !== selectedCertificateIds.length) {
    return {
      valid: false,
      error: "One or more selected certifications are not available",
    };
  }

  return { valid: true };
}
