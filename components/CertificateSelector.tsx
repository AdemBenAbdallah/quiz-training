"use client";

import { Button } from "@/components/ui/button";
import {
  getAvailableCertificates,
  getDefaultCertificate,
} from "@/lib/certificates";
import { Certificate } from "@/types/certificate";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CertificateSelector() {
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

  if (certificates.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="loading-spinner w-12 h-12 mx-auto"></div>
            <p className="text-gray-400">Loading certifications...</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredCert =
    certificates.find((cert) => cert.slug === defaultCert?.slug) ||
    certificates[0];
  const otherCerts = certificates.filter(
    (cert) => cert.slug !== featuredCert.slug,
  );

  return (
    <section className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* All Certifications */}
        <AllCertificationsGrid certificates={otherCerts} />
      </div>
    </section>
  );
}

function AllCertificationsGrid({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert) => (
        <Link
          key={cert.slug}
          href={`/${cert.slug}/levels`}
          className="block h-full"
        >
          <div className="certificate-card rounded-2xl p-6 h-[400px] flex flex-col hover:scale-105 transition-all duration-300 group">
            <div className="space-y-4 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{cert.description}</p>
                </div>
                <div className="ml-4">
                  <div className="cert-badge w-16 h-16 group-hover:scale-110 transition-transform duration-300">
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
                              <div class="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-2xl flex items-center justify-center">
                                <Award class="w-8 h-8 text-primary" />
                              </div>
                            `;
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {cert.totalLevels}
                  </div>
                  <div className="text-xs text-gray-400">Levels</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {cert.totalLevels * 8}h
                  </div>
                  <div className="text-xs text-gray-400">Study Time</div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-neutral-600 text-neutral-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
