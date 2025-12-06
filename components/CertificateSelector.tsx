"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAvailableCertificates,
  getDefaultCertificate,
} from "@/lib/certificates";
import { Certificate } from "@/types/certificate";
import { BookOpen, Trophy } from "lucide-react";
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
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* All Certifications */}
        <AllCertificationsGrid certificates={otherCerts} />
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <div className="text-center space-y-8 py-12 relative">
      <div className="absolute inset-0 hero-bg rounded-3xl opacity-30" />

      <div className="relative z-10 space-y-6">
        <Badge
          variant="outline"
          className="px-4 py-2 border-red-500/30 text-red-400 bg-red-500/10"
        >
          <Trophy className="w-4 h-4 mr-2" />
          AWS Certification Prep
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="text-gradient">Choose Your Path to</span>
          <br />
          <span className="text-gradient-white">Cloud Mastery</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Join thousands of professionals advancing their careers with our
          comprehensive AWS certification preparation
        </p>
      </div>
    </div>
  );
}

function AllCertificationsGrid({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          All Certifications
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our complete catalog of AWS certification preparation courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Link key={cert.slug} href={`/${cert.slug}/levels`} className="block">
            <div className="certificate-card rounded-2xl p-6 h-full hover:scale-105 transition-all duration-300 group">
              <div className="space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-red-400 transition-colors">
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
                              <div class="w-full h-full bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-xl flex items-center justify-center">
                                <Award class="w-8 h-8 text-red-400" />
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
                    className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
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
    </div>
  );
}
