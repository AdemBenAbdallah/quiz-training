"use client";

import { Badge } from "@/components/ui/badge";
import {
  getAvailableCertificates,
  getDefaultCertificate,
} from "@/lib/certificates";
import { Certificate } from "@/types/certificate";
import Image from "next/image";
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

  // Get certification badge image
  const getCertIcon = (slug: string, certName: string) => {
    // Map certificate slugs to badge filenames
    const badgeMap: { [key: string]: string } = {
      clfc02: "clfc02",
      aifc01: "aifc01",
      deac01: "deac01",
      dopc02: "dopc02",
      mlac01: "mlac01",
      mlsc01: "mlsc01",
      ansc01: "ansc01",
      dvac02: "dvac02",
      scsc02: "scsc02",
    };

    const badgeName = badgeMap[slug] || slug;

    return (
      <div className="relative flex justify-center items-center">
        <div className="w-40 h-40 relative">
          <Image
            src={`/badges/${badgeName}.png`}
            alt={`${certName} badge`}
            fill
            className="object-contain rounded-2xl p-3"
            onError={(e) => {
              // Fallback to SVG if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <svg
                    class="w-28 h-28 text-white"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                  >
                    <path d="M210.7 191.4c-4.7 3.4-70.7 48.6-139.5 48.6-43.1 0-79.7-15.2-79.7-45.2 0-29.9 35.5-45.4 62.5-55.1 32.1-11.6 58.1-27.9 58.1-55.8 0-28.6-24.6-46.3-60.6-46.3-29.7 0-54.9 9.7-76.4 28.4l16.1 18.9c18.7-15.6 40.1-24.6 62-24.6 27.8 0 49.4 12.4 49.4 35.2 0 21.6-13.7 34.9-48.8 47.6-41.9 15-70.9 38.3-70.9 73.4 0 35.9 29.7 59.8 71.7 59.8 32.7 0 60.9-10.7 80.4-29.9l-16.3-17.9z" />
                  </svg>
                `;
              }
            }}
          />
        </div>
      </div>
    );
  };

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
              return (
                <Link
                  key={`${cert.id}-${index}`}
                  className="flex-none w-[380px]"
                  href={`/${cert.slug}/levels`}
                >
                  <div
                    className={`group relative rounded-[1.3rem] border border-white/5  p-1.5 hover:border-white/10 transition-all duration-500`}
                  >
                    <div className="custom-card h-[420px] flex flex-col overflow-hidden">
                      {/* Centered Badge and Content */}
                      <div className="relative flex-1 flex flex-col justify-center items-center text-center p-6">
                        {/* Popular Badge */}
                        {cert.slug === defaultCert?.slug && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                              Popular
                            </Badge>
                          </div>
                        )}

                        {/* Large Centered Badge */}
                        <div className="mb-8">
                          {getCertIcon(cert.slug, cert.name)}
                        </div>

                        {/* Certificate Info */}
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-white">
                            {cert.name}
                          </h3>
                          <p className="text-white/80 text-base max-w-xs leading-relaxed">
                            {cert.description}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-2 mt-2">
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
                          <span className="text-sm text-white/80 font-medium ">
                            {cert.totalLevels} levels
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
