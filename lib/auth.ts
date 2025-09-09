import { db } from "@/db/index";
import { schema } from "@/db/schema";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
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
            console.log("Received webhook:", payload.event_type);
          },
        }),
      ],
    }),
  ],
});
