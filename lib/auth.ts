import { db } from "@/db/index";
import { schema, userPayment, userLevelProgress } from "@/db/schema";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, openAPI } from "better-auth/plugins";
import React from "react";
import { Resend } from "resend";
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";

const resend = new Resend(process.env.RESEND_API_KEY!);
export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: "test_mode",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Initialize user level progress - Level 1 is accessible, others are locked
          const initialProgress = [
            {
              id: `${user.id}_1`,
              userId: user.id,
              levelId: 1,
              passed: false,
            },
            {
              id: `${user.id}_2`,
              userId: user.id,
              levelId: 2,
              passed: false,
            },
            {
              id: `${user.id}_3`,
              userId: user.id,
              levelId: 3,
              passed: false,
            },
            {
              id: `${user.id}_4`,
              userId: user.id,
              levelId: 4,
              passed: false,
            },
            {
              id: `${user.id}_5`,
              userId: user.id,
              levelId: 5,
              passed: false,
            },
            {
              id: `${user.id}_6`,
              userId: user.id,
              levelId: 6,
              passed: false,
            },
            {
              id: `${user.id}_7`,
              userId: user.id,
              levelId: 7,
              passed: false,
            },
            {
              id: `${user.id}_8`,
              userId: user.id,
              levelId: 8,
              passed: false,
            },
          ];

          await db.insert(userLevelProgress).values(initialProgress);
          console.log(`Created initial progress for user: ${user.id}`);
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
          from: "Acme <onboarding@resend.dev>",
          to: email,
          subject: "Your sign-in link",
          text: `Sign in to Your App:\n${url}\n\nThis link expires in 15 minutes.`,
          react: React.createElement(MagicLinkEmail, {
            firstName: "",
            magicLinkUrl: url,
            appName: "Your App",
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
              productId: "pdt_z28uLLeKQEqtPzrqMt85k",
              slug: "premium-plan",
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
              const productSlug: string =
                data?.product_cart?.[0]?.product_slug || "premium-plan";

              console.log("Received webhook (normalized):", {
                event,
                userId,
                paymentId,
                amount,
                currency,
                productSlug,
              });

              if (
                event === "payment.succeeded" ||
                (data?.status === "succeeded" && paymentId)
              ) {
                if (userId && paymentId) {
                  await db
                    .insert(userPayment)
                    .values({
                      id: crypto.randomUUID(),
                      userId,
                      paymentId,
                      status: "completed",
                      amount,
                      currency,
                      productSlug,
                    })
                    .onConflictDoNothing();

                  console.log(`Payment recorded for user: ${userId}`);
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
