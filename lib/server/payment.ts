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
    // Use a simple query with only the most basic columns that should exist
    const userPayments = await db
      .select({
        id: userPayment.id,
        userId: userPayment.userId,
        paymentId: userPayment.paymentId,
        status: userPayment.status,
        purchasedCertificates: userPayment.purchasedCertificates,
      })
      .from(userPayment)
      .where(eq(userPayment.userId, userId));

    if (userPayments.length === 0) {
      return {
        hasPayment: false,
        bundleType: null,
        certificateCount: 0,
        purchasedCertificates: [] as string[],
      };
    }

    // Check if user has any completed payments
    const completedPayments = userPayments.filter(
      (p) => p.status === "completed",
    );

    if (completedPayments.length === 0) {
      return {
        hasPayment: false,
        bundleType: null,
        certificateCount: 0,
        purchasedCertificates: [] as string[],
        purchasedCertificateSlugs: [] as string[],
      };
    }

    const purchasedCertificateIds = userPayments
      .filter((p) => p.status === "completed" && p.purchasedCertificates)
      .flatMap((p) => {
        try {
          // Parse JSON string to get array of certificate IDs
          if (!p.purchasedCertificates) return [];
          const certificates = JSON.parse(p.purchasedCertificates) as string[];
          return certificates || [];
        } catch (error) {
          console.warn(
            "Failed to parse purchasedCertificates:",
            p.purchasedCertificates,
          );
          return [];
        }
      })
      .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
    console.log("here purchasedCertificateIds", purchasedCertificateIds);

    const allActiveCerts =
      purchasedCertificateIds.length > 0
        ? await db
            .select()
            .from(certificates)
            .where(
              and(
                eq(certificates.isActive, true),
                inArray(certificates.id, purchasedCertificateIds),
              ),
            )
        : [];

    let bundleType: BundleType = "individual";
    if (allActiveCerts.length === 11) {
      bundleType = "complete";
    } else if (allActiveCerts.length === 3) {
      bundleType = "professional";
    }

    return {
      hasPayment: true,
      bundleType,
      certificateCount: allActiveCerts.length,
      purchasedCertificates: allActiveCerts.map((cert) => cert.id),
      purchasedCertificateSlugs: allActiveCerts.map((cert) => cert.slug),
    };
  } catch (error) {
    console.error("Error getting user bundle info:", error);
    return {
      hasPayment: false,
      bundleType: null,
      certificateCount: 0,
      purchasedCertificates: [] as string[],
      purchasedCertificateSlugs: [] as string[],
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
      const bundleInfo = await getUserBundleInfo(userId);
      return bundleInfo.hasPayment;
    }

    const bundleInfo = await getUserBundleInfo(userId);

    if (!bundleInfo.hasPayment) {
      console.log(`hasActivePurchase: User ${userId} has no active payment`);
      return false;
    }

    if (bundleInfo.bundleType === "complete") {
      console.log(`hasActivePurchase: User ${userId} has complete bundle - access to all certificates`);
      return true;
    }

    const purchasedIds = bundleInfo.purchasedCertificates || [];
    const purchasedSlugs = bundleInfo.purchasedCertificateSlugs || [];

    const hasAccess = purchasedIds.includes(certificateId) || purchasedSlugs.includes(certificateId);

    if (!hasAccess) {
      console.log(`hasActivePurchase: Certificate ${certificateId} not found in user ${userId}'s purchased certificates`, {
        purchasedIds,
        purchasedSlugs,
      });
    } else {
      console.log(`hasActivePurchase: Certificate ${certificateId} found in user ${userId}'s purchased certificates`);
    }

    return hasAccess;
  } catch (error) {
    console.error(`hasActivePurchase: Error checking access for user ${userId}, certificate ${certificateId}:`, error);
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
      purchasedCertificates: bundleInfo.purchasedCertificates as string[],
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

      return [...allCerts.map((cert) => cert.id), ...allCerts.map((cert) => cert.slug)];
    }

    // Return user's specific purchased certificates (both IDs and slugs for compatibility)
    const purchasedIds = (bundleInfo.purchasedCertificates || []) as string[];
    const purchasedSlugs = (bundleInfo.purchasedCertificateSlugs || []) as string[];
    return [...purchasedIds, ...purchasedSlugs];
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

// Get all user's payments
export async function getUserPayments(userId: string) {
  try {
    // Use full columns to get complete payment information
    const payments = await db
      .select({
        id: userPayment.id,
        userId: userPayment.userId,
        paymentId: userPayment.paymentId,
        status: userPayment.status,
        purchasedCertificates: userPayment.purchasedCertificates,
        bundleType: userPayment.bundleType,
        certificateCount: userPayment.certificateCount,
      })
      .from(userPayment)
      .where(eq(userPayment.userId, userId));

    return payments.map((payment) => ({
      ...payment,
      purchasedCertificates: payment.purchasedCertificates
        ? JSON.parse(payment.purchasedCertificates as string)
        : [],
      certificateCount: payment.certificateCount || 1,
      bundleType: payment.bundleType || "individual",
    }));
  } catch (error) {
    console.error("Error getting user payments:", error);
    return [];
  }
}

// Check if user already purchased a specific certificate
export async function hasUserPurchasedCertificate(
  userId: string,
  certificateId: string,
): Promise<boolean> {
  try {
    const bundleInfo = await getUserBundleInfo(userId);
    if (!bundleInfo.hasPayment) {
      return false;
    }

    if (bundleInfo.bundleType === "complete") {
      return true;
    }

    const purchasedIds = bundleInfo.purchasedCertificates || [];
    const purchasedSlugs = bundleInfo.purchasedCertificateSlugs || [];

    return purchasedIds.includes(certificateId) || purchasedSlugs.includes(certificateId);
  } catch (error) {
    console.error("Error checking certificate purchase:", error);
    return false;
  }
}

// Determine new certificates to add based on existing payments
export function determineNewCertificates(
  selectedCertificates: string[],
  existingPayments: any[],
): string[] {
  // Check if this is a complete bundle purchase (empty selectedCertificates for complete)
  const isCompleteBundle = selectedCertificates.length === 0;

  // Get all certificates user currently owns
  const ownedCertificates = new Set<string>();

  for (const payment of existingPayments) {
    if (payment.status === "completed") {
      if (payment.bundleType === "complete") {
        // Complete bundle has all certificates
        return []; // No new certificates needed since user will have all certificates
      }

      if (payment.purchasedCertificates) {
        try {
          const certificates = JSON.parse(
            payment.purchasedCertificates,
          ) as string[];
          for (const certId of certificates || []) {
            ownedCertificates.add(certId);
          }
        } catch (error) {
          console.warn(
            "Failed to parse purchasedCertificates in determineNewCertificates:",
            payment.purchasedCertificates,
          );
        }
      }
    }
  }

  if (isCompleteBundle) {
    // For complete bundle, we need to get ALL active certificates from database
    // This will be handled in the calling function to avoid circular dependency
    return []; // Return empty array, but caller will handle complete bundle specially
  }

  // Return only certificates user doesn't already own
  return selectedCertificates.filter(
    (certId) => !ownedCertificates.has(certId),
  );
}

// Update or create payment record with merged certificates
export async function upsertPaymentRecord(
  userId: string,
  newCertificates: string[],
  paymentData: {
    paymentId: string;
    amount: number;
    currency: string;
    bundleType: string;
    certificateCount: number;
    selectedCertificates: string[];
    certificateId?: string | null;
  },
) {
  try {
    const existingPayments = await getUserPayments(userId);

    // Handle complete bundle specially - should always give access to all certificates
    if (paymentData.bundleType === "complete") {
      console.log(
        `🏆 Processing complete bundle for user ${userId} - giving access to all certificates`,
      );

      if (existingPayments.length === 0) {
        // No existing payments, create new complete bundle record
        await db.insert(userPayment).values({
          id: crypto.randomUUID(),
          userId,
          certificateId: null,
          paymentId: paymentData.paymentId,
          status: "completed",
          amount: paymentData.amount,
          currency: paymentData.currency,
          bundleType: "complete",
          certificateCount: 11,
          purchasedCertificates: null, // null means all certificates
        });

        console.log(`✅ Created complete bundle record for user ${userId}`);
        return {
          action: "created",
          certificates: [], // Will be filled by caller with all certificates
        };
      }

      // Update the highest tier payment to complete bundle
      const sortedPayments = existingPayments.sort((a, b) => {
        const aCount = a.certificateCount || 1;
        const bCount = b.certificateCount || 1;
        return bCount - aCount;
      });

      const highestTierPayment = sortedPayments[0];

      // Update to complete bundle
      await db
        .update(userPayment)
        .set({
          certificateCount: 11 as any,
          bundleType: "complete" as any,
          purchasedCertificates: null as any, // null means all certificates
          updatedAt: new Date(),
        })
        .where(eq(userPayment.id, highestTierPayment.id));

      console.log(
        `✅ Updated payment record to complete bundle for user ${userId}`,
      );
      return {
        action: "updated",
        certificates: [], // Will be filled by caller with all certificates
      };
    }
    // Handle non-complete bundle logic (individual/professional)
    if (existingPayments.length === 0) {
      // No existing payments, create new record
      await db.insert(userPayment).values({
        id: crypto.randomUUID(),
        userId,
        certificateId: paymentData.certificateId,
        paymentId: paymentData.paymentId,
        status: "completed",
        amount: paymentData.amount,
        currency: paymentData.currency,
        bundleType: paymentData.bundleType as any,
        certificateCount: paymentData.certificateCount as any,
        purchasedCertificates:
          paymentData.selectedCertificates.length > 0
            ? (JSON.stringify(paymentData.selectedCertificates) as any)
            : (null as any),
      });

      console.log(`✅ Created new payment record for user ${userId}`);
      return {
        action: "created",
        certificates: paymentData.selectedCertificates,
      };
    }

    // Get the highest tier payment to update
    const sortedPayments = existingPayments.sort((a, b) => {
      const aCount = a.certificateCount || 1;
      const bCount = b.certificateCount || 1;
      return bCount - aCount;
    });

    const highestTierPayment = sortedPayments[0];
    const existingCertificates = highestTierPayment.purchasedCertificates || [];

    // Merge existing and new certificates
    const allCertificates: string[] = [...existingCertificates];
    for (const newCert of newCertificates) {
      if (!allCertificates.includes(newCert)) {
        allCertificates.push(newCert);
      }
    }

    // Determine final bundle type based on certificate count
    let finalBundleType = highestTierPayment.bundleType;
    let finalCertificateCount = allCertificates.length;

    if (finalCertificateCount === 11) {
      finalBundleType = "complete";
    } else if (finalCertificateCount === 3) {
      finalBundleType = "professional";
    } else {
      finalBundleType = "individual";
    }

    // Update the highest tier payment record
    await db
      .update(userPayment)
      .set({
        certificateCount: finalCertificateCount as any,
        bundleType: finalBundleType as any,
        purchasedCertificates: JSON.stringify(allCertificates) as any,
        updatedAt: new Date(),
      })
      .where(eq(userPayment.id, highestTierPayment.id));

    console.log(`✅ Updated payment record for user ${userId}:`, {
      previousCertificates: existingCertificates.length,
      newCertificates: newCertificates.length,
      finalCertificates: allCertificates.length,
      finalBundleType,
    });

    return {
      action: "updated",
      certificates: allCertificates,
      newCertificatesAdded: newCertificates,
    };
  } catch (error) {
    console.error("Error upserting payment record:", error);
    throw error;
  }
}

// Merge certificate access across all payments
export async function mergeCertificateAccess(userId: string) {
  try {
    const payments = await getUserPayments(userId);

    if (payments.length === 0) {
      return;
    }

    // Get all certificates from all completed payments
    const allCertificates = new Set<string>();

    for (const payment of payments) {
      if (payment.status === "completed") {
        if (payment.bundleType === "complete") {
          // Complete bundle has access to all certificates
          // Get all active certificates from database
          const allActiveCerts = await db
            .select()
            .from(certificates)
            .where(eq(certificates.isActive, true));

          for (const cert of allActiveCerts) {
            allCertificates.add(cert.id);
          }
          break; // Complete bundle has all, no need to process others
        }

        for (const certId of payment.purchasedCertificates || []) {
          allCertificates.add(certId);
        }
      }
    }

    // Update the most recent payment with merged certificate list
    const latestPayment = payments[0]; // Use first payment since we can't sort by createdAt

    if (latestPayment && allCertificates.size > 0) {
      await db
        .update(userPayment)
        .set({
          purchasedCertificates: JSON.stringify(
            Array.from(allCertificates),
          ) as any,
          certificateCount: allCertificates.size as any,
          updatedAt: new Date(),
        })
        .where(eq(userPayment.id, latestPayment.id));

      console.log(`✅ Merged certificate access for user ${userId}:`, {
        totalCertificates: allCertificates.size,
        certificates: Array.from(allCertificates),
      });
    }
  } catch (error) {
    console.error("Error merging certificate access:", error);
  }
}

// Enhanced webhook payment processing with merging logic
export async function processWebhookPayment(
  userId: string,
  paymentData: {
    paymentId: string;
    amount: number;
    currency: string;
    bundleType: string;
    certificateCount: number;
    selectedCertificates: string[];
    certificateId?: string | null;
  },
) {
  try {
    console.log(
      "🔄 Processing webhook payment with merging logic:",
      paymentData,
    );

    // Check if user already has payments
    const existingPayments = await getUserPayments(userId);

    // Special handling for complete bundle
    if (paymentData.bundleType === "complete") {
      console.log(
        `🏆 User ${userId} is purchasing complete bundle - giving access to all certificates`,
      );

      // Get all active certificates from database
      const allActiveCerts = await db
        .select()
        .from(certificates)
        .where(eq(certificates.isActive, true));

      console.log(`📋 Found ${allActiveCerts.length} active certificates`);

      // Process complete bundle with all certificates
      const result = await upsertPaymentRecord(
        userId,
        allActiveCerts.map((cert) => cert.id), // All certificate IDs
        paymentData,
      );

      // Merge certificate access across all payments
      await mergeCertificateAccess(userId);

      return {
        ...result,
        certificates: allActiveCerts.map((cert) => cert.id),
      };
    }

    // Validate selected certificates exist in database (for individual/professional bundles)
    let validCertificates: string[] = [];
    if (paymentData.selectedCertificates.length > 0) {
      const allValidCerts = await db
        .select()
        .from(certificates)
        .where(eq(certificates.isActive, true));

      const validCertIds = new Set(allValidCerts.map((c) => c.id));
      const validCertSlugs = new Set(allValidCerts.map((c) => c.slug));

      validCertificates = paymentData.selectedCertificates.filter(
        (certId) => validCertIds.has(certId) || validCertSlugs.has(certId),
      );

      const invalidCerts = paymentData.selectedCertificates.filter(
        (certId) => !validCertIds.has(certId) && !validCertSlugs.has(certId),
      );

      if (invalidCerts.length > 0) {
        console.warn(
          `⚠️ Filtered out invalid certificates: ${invalidCerts.join(", ")}`,
        );
      }

      if (validCertificates.length === 0) {
        console.error(
          `❌ No valid certificates found in selected certificates for user ${userId}`,
        );
        return { action: "failed", reason: "no_valid_certificates" };
      }

      console.log(`✅ Validated ${validCertificates.length} certificates for user ${userId}`);
    }

    // Handle individual and professional bundles
    if (existingPayments.length > 0) {
      console.log(
        `📊 User ${userId} has ${existingPayments.length} existing payments`,
      );

      // Check for duplicates
      const alreadyOwned = await Promise.all(
        validCertificates.map((certId) =>
          hasUserPurchasedCertificate(userId, certId),
        ),
      );

      const duplicateCount = alreadyOwned.filter(Boolean).length;

      if (duplicateCount > 0) {
        console.log(
          `⚠️ User ${userId} already owns ${duplicateCount} of the selected certificates`,
        );
      }

      // Determine new certificates to add
      const newCertificates = determineNewCertificates(
        validCertificates,
        existingPayments,
      );

      if (newCertificates.length === 0) {
        console.log(
          `ℹ️ User ${userId} already owns all selected certificates, skipping payment record creation`,
        );
        return { action: "skipped", reason: "all_certificates_already_owned" };
      }

      console.log(
        `➕ Adding ${newCertificates.length} new certificates for user ${userId}`,
      );

      // Upsert payment record with merged certificates
      const result = await upsertPaymentRecord(
        userId,
        newCertificates,
        paymentData,
      );

      // Merge certificate access across all payments
      await mergeCertificateAccess(userId);

      return result;
    } else {
      // No existing payments, create new record
      await db.insert(userPayment).values({
        id: crypto.randomUUID(),
        userId,
        certificateId: paymentData.certificateId,
        paymentId: paymentData.paymentId,
        status: "completed",
        amount: paymentData.amount,
        currency: paymentData.currency,
        bundleType: paymentData.bundleType as any,
        certificateCount: paymentData.certificateCount as any,
        purchasedCertificates:
          validCertificates.length > 0
            ? (JSON.stringify(validCertificates) as any)
            : (null as any),
      });

      return {
        action: "created",
        certificates: validCertificates,
      };
    }
  } catch (error) {
    console.error("Error processing webhook payment:", error);
    throw error;
  }
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
