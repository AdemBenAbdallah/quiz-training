import { db } from "@/db/index";
import { schema, userLevelProgress, userPayment } from "@/db/schema";
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
          successUrl: "/levels",
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

              // Your app user id passed during checkout as referenceId
              const userId: string | undefined = data?.metadata?.referenceId;

              // Payment details
              const paymentId: string | undefined =
                data?.payment_id || data?.id;
              const amount: number =
                data?.total_amount ?? data?.settlement_amount ?? 0;
              const currency: string =
                data?.settlement_currency ?? data?.currency ?? "USD";
              // Get product details from product_cart
              const productCart = data?.product_cart || [];
              const firstProduct = productCart[0];
              const productId: string = firstProduct?.product_id;
              const productSlug: string = firstProduct?.product_slug;

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

                  let bundleType: string | null =
                    bundleInfo?.bundleType || "individual";
                  let certificateCount: number | null =
                    bundleInfo?.certificateCount || 1;
                  let purchasedCertificates: string[] = [];
                  let certificateId: string | null = null;

                  // Determine bundle configuration based on plan type
                  if (
                    planType === "individual" &&
                    selectedCertificates.length > 0
                  ) {
                    bundleType = "individual";
                    certificateCount = 1;
                    certificateId = selectedCertificates[0] as string;
                    purchasedCertificates = [certificateId];
                  } else if (planType === "professional") {
                    bundleType = "professional";
                    certificateCount = 3;
                    purchasedCertificates = selectedCertificates;
                  } else if (planType === "complete") {
                    bundleType = "complete";
                    certificateCount = 11;
                    // For complete bundle, we'll handle this differently
                    purchasedCertificates = [];
                  } else {
                    // Fallback for legacy payments
                    bundleType = "complete";
                    certificateCount = 11;
                    certificateId =
                      data?.metadata?.certificateId ||
                      (productSlug.includes("-")
                        ? productSlug.split("-")[1]
                        : "dvac02");
                    purchasedCertificates = certificateId
                      ? [certificateId]
                      : [];
                  }

                  await db
                    .insert(userPayment)
                    .values({
                      id: crypto.randomUUID(),
                      userId,
                      certificateId,
                      paymentId,
                      status: "completed",
                      amount,
                      currency,
                      productSlug,
                      bundleType,
                      certificateCount,
                      purchasedCertificates:
                        purchasedCertificates.length > 0
                          ? JSON.stringify(purchasedCertificates)
                          : null,
                    })
                    .onConflictDoNothing();

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
