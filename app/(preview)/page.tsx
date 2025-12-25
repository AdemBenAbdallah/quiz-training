import CertificateSelectorHome from "@/components/certificate-selector/CertificateSelectorHome";
import CountdownTimer from "@/components/CountdownTimer";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import Faq from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Navigation from "@/components/landing/navigation";
import Review from "@/components/landing/review";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import { eq, sql } from "drizzle-orm";
import { Target } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

async function getUsers() {
  const [users, countResult] = await Promise.all([
    db
      .select({
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.emailVerified, true))
      .orderBy(sql`${user.image} IS NOT NULL DESC`)
      .limit(6),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(eq(user.emailVerified, true)),
  ]);

  return { users, totalCount: countResult[0].count };
}

export default async function HomePage() {
  let session = null;

  // Skip auth check during prerendering to avoid NEXT_REDIRECT errors
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // During prerendering or other contexts where headers() fails, continue without session
    logger.log("Session not available during prerendering");
  }

  const { users, totalCount } = await getUsers();

  return (
    <ClientProvider session={session}>
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
        <div className="relative">
          <Navigation />

          {/* Urgency Banner */}
          <div className="bg-white text-black py-2 text-center flex justify-center items-center">
            <p className="text-sm font-medium flex gap-2 items-center">
              <Target className="h-5" /> Limited Time: 50% OFF All Plans -{" "}
              <CountdownTimer />{" "}
              <Link href="/pricing">
                <span className="text-red-700 font-semibold">
                  {" "}
                  Get Discount →
                </span>
              </Link>
            </p>
          </div>
          <Hero users={users} totalCount={totalCount} />
          <CertificateSelectorHome />
          <Features />
          <HowItWorks />
          <Review />
          <Faq />
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
        </div>
      </div>
    </ClientProvider>
  );
}
