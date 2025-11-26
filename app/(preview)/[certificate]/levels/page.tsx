import Footer from "@/components/footer/Footer";
import CertificateHero from "@/components/CertificateHero";
import { getCertificateBySlug, getDefaultCertificate } from "@/lib/certificates";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface CertificateLevelsPageProps {
  params: Promise<{ certificate: string }>;
}

export default async function CertificateLevelsPage({ params }: CertificateLevelsPageProps) {
  const { certificate } = await params;
  
  // Validate certificate exists
  const cert = getCertificateBySlug(certificate);
  if (!cert) {
    redirect('/certificates');
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const handleStart = () => {
    // Navigate to first level, first part
    redirect(`/${certificate}/quiz/1/1`);
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
      <div className="relative">
        <CertificateHero certificateSlug={certificate} onStart={handleStart} />
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}