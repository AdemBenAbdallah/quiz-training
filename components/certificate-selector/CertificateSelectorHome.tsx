"use client";

import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/section-header";
import {
  getAvailableCertificates,
  getDefaultCertificate,
} from "@/lib/certificates";
import { Certificate } from "@/types/certificate";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CertificateSelectorHome() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [defaultCert, setDefaultCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const certs = getAvailableCertificates();
      const defaultCertificate = getDefaultCertificate();
      setCertificates(certs);
      setDefaultCert(defaultCertificate);
    };

    loadData();
  }, []);

  // Get all certificates for the infinite scroll
  const allCerts = useMemo(() => {
    if (certificates.length === 0) return [];

    const featuredCert =
      certificates.find((cert) => cert.slug === defaultCert?.slug) ||
      certificates[0];

    const otherCerts = certificates.filter(
      (cert) => cert.slug !== featuredCert.slug,
    );

    // Return featured + all others for infinite scroll
    return [featuredCert, ...otherCerts];
  }, [certificates, defaultCert]);

  // Duplicate certificates for seamless infinite scroll
  const scrollItems = useMemo(() => {
    if (allCerts.length === 0) return [];

    // Create multiple sets for smooth infinite scroll
    const sets = 3;
    const items = [];

    for (let i = 0; i < sets; i++) {
      items.push(...allCerts);
    }

    return items;
  }, [allCerts]);

  if (certificates.length === 0) {
    return (
      <section className="py-24">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="loading-spinner w-12 h-12 mx-auto"></div>
            <p className="text-gray-400">Loading certifications...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 space-y-6">
      <SectionHeader
        subtitle="All Certifications"
        title="Explore our complete catalog of AWS certification"
      />

      <div className="max-w-7xl mx-auto">
        {/* Infinite Scroll Container */}
        <div className="relative overflow-hidden">
          <style jsx>{`
            .scroll-container {
              display: flex;
              gap: 1.5rem;
              animation: scroll 45s linear infinite;
              width: max-content;
            }

            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .scroll-container {
                animation: none;
                overflow-x: auto;
              }

              .scroll-container::-webkit-scrollbar {
                display: none;
              }
            }
          `}</style>

          <div className="scroll-container pb-4">
            {scrollItems.map((cert, index) => (
              <div key={`${cert.slug}-${index}`} className="flex-none w-80">
                <Link href={`/${cert.slug}/levels`} className="block h-full">
                  <div className="certificate-card rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group cursor-pointer bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-neutral-700/50 backdrop-blur-sm">
                    <div className="space-y-4 h-full flex flex-col min-h-[255px]">
                      {/* Header */}
                      <div className="text-center">
                        <div className="cert-badge w-16 h-16 mx-auto mb-4 transition-transform duration-300">
                          <Image
                            src={`/badges/${cert.slug}.png`}
                            alt={`${cert.name} badge`}
                            fill
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-xl flex items-center justify-center">
                                    <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                        <h5 className="font-bold text-white text-lg mb-3 transition-colors leading-tight">
                          {cert.name}
                        </h5>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                          {cert.description}
                        </p>
                        <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {cert.totalLevels} levels
                          </span>
                          <span>•</span>
                          <span>{cert.totalLevels * 8}h study</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-neutral-600 text-neutral-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group-hover:shadow-lg"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Gradient Fade Indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/certificates">
            <Button
              variant="outline"
              size="lg"
              className="border-neutral-600 text-neutral-300 px-8"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View All Certifications
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
