import CertificateSelectorPage from "@/components/certificate-selector/CertificateSelectorPage";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function CertificatesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <ClientProvider session={session}>
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
        <div className="relative container mx-auto px-4 py-16">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  All Certifications
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Explore our complete catalog of AWS certification preparation
                  courses
                </p>
              </div>

              <CertificateSelectorPage />
            </div>
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
        </div>
      </div>
    </ClientProvider>
  );
}
