"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAvailableCertificates,
  getDefaultCertificate,
} from "@/lib/certificates";
import { Certificate } from "@/types/certificate";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CertificateSelectorProps {
  currentCertificate?: string;
}

export default function CertificateSelector({
  currentCertificate,
}: CertificateSelectorProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [defaultCert, setDefaultCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const certs = getAvailableCertificates();
      const defaultCert = getDefaultCertificate();
      setCertificates(certs);
      setDefaultCert(defaultCert);
    };

    loadData();
  }, []);

  if (certificates.length === 0) {
    return <div>Loading certificates...</div>;
  }

  // If only one certificate, don't show selector
  if (certificates.length === 1) {
    return null;
  }

  // Get certification icon
  const getCertIcon = (slug: string) => {
    if (slug === "aws-developer" || slug === "ansc01") {
      return (
        <svg
          className="w-16 h-16 text-white"
          viewBox="0 0 256 256"
          fill="currentColor"
        >
          <path d="M210.7 191.4c-4.7 3.4-70.7 48.6-139.5 48.6-43.1 0-79.7-15.2-79.7-45.2 0-29.9 35.5-45.4 62.5-55.1 32.1-11.6 58.1-27.9 58.1-55.8 0-28.6-24.6-46.3-60.6-46.3-29.7 0-54.9 9.7-76.4 28.4l16.1 18.9c18.7-15.6 40.1-24.6 62-24.6 27.8 0 49.4 12.4 49.4 35.2 0 21.6-13.7 34.9-48.8 47.6-41.9 15-70.9 38.3-70.9 73.4 0 35.9 29.7 59.8 71.7 59.8 32.7 0 60.9-10.7 80.4-29.9l-16.3-17.9z" />
          <path d="M184.5 93.8c17.8 0 36.6-13.5 45.7-29.5l-24.6-9.7c-6.3 11.6-17.8 18.9-29.7 18.9-20.8 0-37.3-16.6-39.6-36.6h77.3c1.5-6.4 2.3-13 2.3-19.7 0-25.5-16.1-56.4-63.5-56.4-37.1 0-70.3 21.4-85.5 53.5l25.1 8.9c9.8-20.5 28.4-33.1 50.4-33.1 25.9 0 44.3 17.9 44.3 42 0 3.1-.3 6.3-.9 9.3-25.5 3.1-55.8 16.9-70.3 42.1l25.4 9.1c11.4-20.4 31.5-33.8 52.5-33.8z" />
        </svg>
      );
    }

    // Demo certificate icon
    return (
      <svg
        className="w-16 h-16 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    );
  };

  // Get gradient colors for certificate - neutral gradient
  const getGradientColors = () => {
    return "from-gray-700 to-gray-900";
  };

  // Duplicate certificates for seamless infinite scroll
  const scrollCards = [...certificates, ...certificates];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-wider text-red-500">
            Choose Your Path
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Select Your Certification
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Choose a certification track and start your preparation journey
          </p>
        </div>

        {/* Infinite scroll container */}
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-scroll">
            {scrollCards.map((cert, index) => {
              const isSelected = currentCertificate === cert.slug;
              const gradientColors = getGradientColors();

              return (
                <div
                  key={`${cert.id}-${index}`}
                  className="flex-none w-[380px]"
                >
                  <div
                    className={`group relative rounded-[1.3rem] border border-white/5  p-1.5 hover:border-white/10 transition-all duration-500 ${
                      isSelected ? "ring-2 ring-white/20" : ""
                    }`}
                  >
                    <div className="custom-card h-[420px] flex flex-col overflow-hidden">
                      {/* Gradient Header with Logo */}
                      <div className={`relative p-6 flex-1`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10 flex items-start gap-4">
                          <div className="shrink-0 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                            {getCertIcon(cert.slug)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {cert.name}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {cert.description}
                            </p>
                          </div>
                        </div>

                        {/* Badge */}
                        {cert.slug === defaultCert?.slug && (
                          <div className="absolute top-6 right-6">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                              Popular
                            </Badge>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4 text-white/60"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                              </svg>
                              <span className="text-sm text-white/80">
                                {cert.totalLevels} levels
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button - White (fixed at bottom) */}
                      <div className="p-6 pt-0">
                        <Button
                          asChild
                          className="w-full h-12 bg-white text-black hover:bg-gray-100 shadow-lg"
                        >
                          <Link href={`/${cert.slug}/levels`}>
                            {isSelected ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Current Path
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                Start Learning
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </span>
                            )}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
