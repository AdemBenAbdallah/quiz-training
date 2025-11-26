"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import PublicQuiz from "@/components/PublicQuiz";
import { getCertificateMetadata, getDefaultCertificate } from "@/lib/certificates";
import { CertificateMetadata } from "@/types/certificate";
import { useEffect, useState } from "react";

interface CertificateHeroProps {
  certificateSlug?: string;
  onStart: () => void;
}

export default function CertificateHero({ certificateSlug, onStart }: CertificateHeroProps) {
  const [metadata, setMetadata] = useState<CertificateMetadata | null>(null);

  useEffect(() => {
    const loadMetadata = () => {
      const slug = certificateSlug || getDefaultCertificate()?.slug;
      if (slug) {
        const certMetadata = getCertificateMetadata(slug);
        setMetadata(certMetadata);
      }
    };

    loadMetadata();
  }, [certificateSlug]);

  // Fallback to original AWS content if no metadata found
  const heroTitle = metadata?.heroTitle || "Master 500+ DVA-C02 Questions.";
  const heroDescription = metadata?.heroDescription || "Don't just memorize dumps. Our gamified quiz app provides detailed explanations for every answer, so you *actually* learn the concepts. Try it free.";
  const badgeColor = metadata?.badgeColor || "bg-red-700";

  return (
    <section className="container mx-auto px-4 py-16 space-y-12">
      <div className="space-y-8 text-center">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-balance !leading-[1.2]">
            {heroTitle}{" "}
            <span className={`${badgeColor} text-white`}>Pass With Confidence.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed text-pretty max-w-6xl">
            {heroDescription}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-white text-black font-semibold px-8 py-4 text-xl rounded-xl transition-all duration-200 hover:scale-105"
          >
            Start For Free
          </Button>
        </div>
      </div>

      <Container>
        <PublicQuiz handleStart={onStart} />
      </Container>
    </section>
  );
}