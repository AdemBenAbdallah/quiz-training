import { db } from "@/db/index";
import { schema } from "@/db/schema";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

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
        console.log("Sending magic link to", email);
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
  ],
});
