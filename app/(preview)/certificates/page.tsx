import Footer from "@/components/footer/Footer";
import CertificateSelector from "@/components/CertificateSelector";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function CertificatesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
      <div className="relative container mx-auto px-4 py-16">
        <Suspense fallback={<div>Loading...</div>}>
          <CertificateSelector />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}