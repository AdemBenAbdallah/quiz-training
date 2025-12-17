import CertificateSelectorHome from "@/components/certificate-selector/CertificateSelectorHome";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import Faq from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Navigation from "@/components/landing/navigation";
import Pricing from "@/components/landing/pricing";
import Review from "@/components/landing/review";
import { Link } from "@/components/ui/link";
import { auth } from "@/lib/auth";
import { Target } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function HomePage() {
  let session = null;

  // Skip auth check during prerendering to avoid NEXT_REDIRECT errors
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // During prerendering or other contexts where headers() fails, continue without session
    console.log("Session not available during prerendering");
  }

  return (
    <ClientProvider session={session}>
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
        <div className="relative">
          <Navigation />

          {/* Urgency Banner */}
          <div className="bg-white text-black py-2 text-center flex justify-center items-center">
            <p className="text-sm font-medium flex gap-2">
              <Target className="h-5" /> Limited Time: 50% OFF All Plans - Ends
              in 48 Hours!{" "}
              <Link href="/pricing">
                <span className="text-red-700 font-semibold">
                  {" "}
                  Get Discount →
                </span>
              </Link>
            </p>
          </div>
          <Hero />
          <CertificateSelectorHome />
          <HowItWorks />
          <Pricing />
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
