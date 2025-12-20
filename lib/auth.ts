import { db } from "@/db/index";
import {
  certificates,
  schema,
  userLevelProgress,
  userPayment,
} from "@/db/schema";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { createInitialProgressForNewUser } from "@/lib/utils/progress";
import {
  checkout,
  dodopayments,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, openAPI } from "better-auth/plugins";
import DodoPayments from "dodopayments";
import { eq } from "drizzle-orm";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const isDev = process.env.NODE_ENV === "development";
export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: isDev ? "test_mode" : "live_mode",
});

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 1 hour
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Initialize user level progress for default certificate using helper function
          const initialProgress = createInitialProgressForNewUser(user.id);

          await db.insert(userLevelProgress).values(initialProgress);
          console.log(
            `Created initial progress for user: ${user.id} with default certificate`,
          );
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    openAPI(),
    magicLink({
      sendMagicLink: async (params) => {
        const { email, url } = params;
        await resend.emails.send({
          from: "Aws Quiz Game <onboarding@adembenabdallah.com>",
          to: email,
          subject: "Quiz Aws: your sign-in link",
          text: `Sign in to Quiz Aws:\n${url}\n\nThis link expires in 15 minutes.`,
          react: React.createElement(MagicLinkEmail, {
            firstName: "",
            magicLinkUrl: url,
            appName: "Quiz Aws",
            expiresInMinutes: 15,
            supportEmail: "support@example.com",
          }),
        });
      },
    }),
    dodopayments({
      client: dodoPayments,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: process.env.NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL!,
              slug: "individual-plan",
            },
            {
              productId: process.env.NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL!,
              slug: "professional-plan",
            },
            {
              productId: process.env.NEXT_PUBLIC_DODO_PRODUCT_COMPLETE!,
              slug: "complete-plan",
            },
          ],
          successUrl: "/payment/success",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
          onPayload: async (payload: any) => {
            try {
              const event =
                payload?.type || payload?.event_type || payload?.event;
              const data = payload?.data || {};

              console.log(
                "🔍 Raw webhook payload:",
                JSON.stringify(payload, null, 2),
              );

              // Your app user id passed during checkout as referenceId
              const userId: string | undefined = data?.metadata?.referenceId;

              // Payment details
              const paymentId: string | undefined =
                data?.payment_id || data?.id;
              const amount: number = Math.round(
                (data?.total_amount ?? data?.settlement_amount ?? 0) / 100,
              );
              const currency: string =
                data?.settlement_currency ?? data?.currency ?? "USD";
              // Get product details from product_cart
              const productCart = data?.product_cart || [];
              const firstProduct = productCart[0];
              const productId: string = firstProduct?.product_id;
              const productSlug: string = firstProduct?.product_slug;

              console.log("💳 Payment details:", {
                userId,
                paymentId,
                amount,
                currency,
                productId,
                productSlug,
                metadata: data?.metadata,
              });

              console.log("Received webhook (normalized):", {
                event,
                userId,
                paymentId,
                amount,
                currency,
                productId,
                productSlug,
              });

              if (
                event === "payment.succeeded" ||
                (data?.status === "succeeded" && paymentId)
              ) {
                if (userId && paymentId) {
                  // Map product IDs back to bundle types
                  const productIdToBundleMap: Record<
                    string,
                    { bundleType: string; certificateCount: number }
                  > = {
                    [process.env.NEXT_PUBLIC_DODO_PRODUCT_INDIVIDUAL || ""]: {
                      bundleType: "individual",
                      certificateCount: 1,
                    },
                    [process.env.NEXT_PUBLIC_DODO_PRODUCT_PROFESSIONAL || ""]: {
                      bundleType: "professional",
                      certificateCount: 3,
                    },
                    [process.env.NEXT_PUBLIC_DODO_PRODUCT_COMPLETE || ""]: {
                      bundleType: "complete",
                      certificateCount: 11,
                    },
                  };

                  const bundleInfo = productId
                    ? productIdToBundleMap[productId]
                    : null;
                  const planType =
                    bundleInfo?.bundleType ||
                    (productSlug ? productSlug.split("-")[0] : "individual");
                  const selectedCertificates = data?.metadata
                    ?.selectedCertificates
                    ? JSON.parse(data.metadata.selectedCertificates)
                    : [];

                  let bundleType: string | null = "individual";
                  let certificateCount: number | null = 1;
                  let purchasedCertificates: string[] = [];
                  let certificateId: string | null = null;
                  let certificateUuid: string | null = null;

                  // Determine bundle configuration based on plan type

                  if (
                    planType === "individual" &&
                    selectedCertificates.length > 0
                  ) {
                    bundleType = "individual";
                    certificateCount = 1;
                    const selectedCertUuid = selectedCertificates[0] as string;

                    // Verify the certificate UUID exists in database
                    const certResult = await db
                      .select()
                      .from(certificates)
                      .where(eq(certificates.id, selectedCertUuid))
                      .limit(1);

                    if (certResult.length > 0) {
                      certificateUuid = certResult[0].id;
                      // Store UUIDs consistently
                      purchasedCertificates = [certificateUuid];
                      console.log(
                        `✅ Individual bundle - certificate UUID: ${certificateUuid}`,
                      );
                    } else {
                      console.warn(
                        `❌ Certificate with UUID "${selectedCertUuid}" not found`,
                      );
                      certificateUuid = null;
                      purchasedCertificates = [];
                    }
                  } else if (planType === "professional") {
                    bundleType = "professional";
                    certificateCount = 3;

                    // Convert UUIDs to actual certificate UUIDs and validate they exist
                    const convertedCerts = [];
                    const missingCerts = [];

                    for (const certUuid of selectedCertificates) {
                      const certResult = await db
                        .select()
                        .from(certificates)
                        .where(eq(certificates.id, certUuid))
                        .limit(1);

                      if (certResult.length > 0) {
                        convertedCerts.push(certResult[0].id); // Store UUID
                        console.log(
                          `✅ Professional bundle - found certificate: ${certResult[0].slug} (${certUuid})`,
                        );
                      } else {
                        missingCerts.push(certUuid);
                        console.warn(
                          `❌ Professional bundle - certificate with UUID "${certUuid}" not found`,
                        );
                      }
                    }

                    // Verify we have all 3 certificates
                    if (convertedCerts.length === 3) {
                      purchasedCertificates = convertedCerts; // Store ALL 3 UUIDs
                      certificateUuid = null; // No single certificate for professional bundle
                      console.log(
                        `✅ Professional bundle - stored all 3 certificates:`,
                        convertedCerts,
                      );
                    } else {
                      console.error(
                        `❌ Professional bundle - expected 3 certificates, got ${convertedCerts.length}. Missing: ${missingCerts.join(", ")}`,
                      );
                      // Still store what we have, but log the error
                      purchasedCertificates = convertedCerts;
                      certificateUuid = null;
                    }

                    // Store the converted UUIDs, not the original slugs
                    purchasedCertificates = convertedCerts; // Store UUIDs for consistency
                    certificateUuid = null; // No single certificate for professional bundle

                    console.log(
                      `✅ Professional bundle - converted certificates:`,
                      convertedCerts,
                    );
                  } else if (planType === "complete") {
                    bundleType = "complete";
                    certificateCount = 11;
                    // Complete bundle has access to all certificates
                    purchasedCertificates = []; // Empty array = all certificates
                    certificateUuid = null;
                  } else {
                    // Fallback for legacy payments
                    bundleType = "complete";
                    certificateCount = 11;
                    certificateId =
                      data?.metadata?.certificateId ||
                      (productSlug && productSlug.includes("-")
                        ? productSlug.split("-")[1]
                        : "dvac02");

                    // Look up certificate UUID by slug for fallback
                    if (certificateId) {
                      const certResult = await db
                        .select()
                        .from(certificates)
                        .where(eq(certificates.slug, certificateId))
                        .limit(1);

                      if (certResult.length > 0) {
                        certificateUuid = certResult[0].id;
                        purchasedCertificates = [certificateUuid]; // Store UUID for consistency
                        console.log(
                          `✅ Fallback bundle - found certificate UUID: ${certificateUuid} for slug: ${certificateId}`,
                        );
                      } else {
                        console.warn(
                          `❌ Fallback bundle - certificate with slug "${certificateId}" not found`,
                        );
                        certificateUuid = null;
                        purchasedCertificates = [];
                      }
                    } else {
                      purchasedCertificates = [];
                    }
                  }

                  console.log("💾 Attempting to insert payment record:", {
                    userId,
                    certificateId,
                    paymentId,
                    status: "completed",
                    amount,
                    currency,
                    bundleType,
                    certificateCount,
                    purchasedCertificates,
                  });

                  try {
                    await db
                      .insert(userPayment)
                      .values({
                        id: crypto.randomUUID(),
                        userId,
                        certificateId: certificateUuid, // Use UUID for individual, null for others
                        paymentId,
                        status: "completed",
                        amount,
                        currency,
                        bundleType,
                        certificateCount,
                        purchasedCertificates:
                          purchasedCertificates.length > 0
                            ? JSON.stringify(purchasedCertificates) // Store UUIDs consistently
                            : null, // null for complete bundle (empty array handled separately)
                      })
                      .onConflictDoNothing();

                    console.log("✅ Payment record inserted successfully");
                  } catch (dbError: any) {
                    console.error("❌ Database insertion failed:", dbError);

                    // If it's a foreign key constraint error, provide more context
                    if (dbError.code === "23503") {
                      console.error("🔍 Foreign key constraint details:", {
                        constraint: dbError.constraint,
                        table: dbError.table,
                        column: dbError.column,
                        certificateId,
                        userId,
                      });

                      // Verify certificate exists
                      if (certificateId) {
                        const certCheck = await db
                          .select()
                          .from(certificates)
                          .where(eq(certificates.id, certificateId))
                          .limit(1);

                        if (certCheck.length === 0) {
                          console.error(
                            `❌ Certificate ${certificateId} not found in database`,
                          );
                        } else {
                          console.log(
                            `✅ Certificate ${certificateId} exists in database`,
                          );
                        }
                      }
                    }

                    throw dbError; // Re-throw to maintain existing error handling
                  }

                  console.log(
                    `Payment recorded for user: ${userId}, bundle: ${bundleType}, certificates: ${certificateCount}`,
                  );
                } else {
                  console.warn(
                    "Missing userId or paymentId in webhook payload",
                    { userId, paymentId },
                  );
                }
              } else if (
                event === "payment.failed" ||
                data?.status === "failed"
              ) {
                console.log("Payment failed:", paymentId);
              } else {
                console.warn("Unhandled webhook event:", event);
              }
            } catch (error) {
              console.error("Webhook processing error:", error);
            }
          },
        }),
      ],
    }),
  ],
});
