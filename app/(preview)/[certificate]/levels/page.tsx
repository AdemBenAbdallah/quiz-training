import CertificateLevels from "@/components/CertificateLevels";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import { auth } from "@/lib/auth";
import { getCertificateBySlug } from "@/lib/certificates";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface CertificateLevelsPageProps {
  params: Promise<{ certificate: string }>;
}

export default async function CertificateLevelsPage({
  params,
}: CertificateLevelsPageProps) {
  const { certificate } = await params;

  // Validate certificate exists
  const cert = getCertificateBySlug(certificate);
  if (!cert) {
    redirect("/certificates");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <ClientProvider session={session}>
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
        <div className="relative">
          <CertificateLevels certificateSlug={certificate} />
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
        </div>
      </div>
    </ClientProvider>
  );
}
