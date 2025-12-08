import CertificateSelectorHome from "@/components/certificate-selector/CertificateSelectorHome";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import Faq from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Navigation from "@/components/landing/navigation";
import Review from "@/components/landing/review";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function HomePage() {
  let session = null;

  // Handle prerendering gracefully
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // During prerendering, headers() will throw, so we continue without session
    console.log("Session not available during prerendering");
  }

  return (
    <ClientProvider session={session}>
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
        <div className="relative">
          <Navigation />
          <Hero />
          <CertificateSelectorHome />
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
