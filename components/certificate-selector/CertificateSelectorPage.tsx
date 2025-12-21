"use client";

import { usePricingModal } from "@/components/pricing";
import { Button } from "@/components/ui/button";
import {
  getAvailableCertificates,
  getDefaultCertificate,
} from "@/lib/certificates";
import { Certificate } from "@/types/certificate";
import { BookOpen, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClientProvider } from "../landing/client-provider";

interface CertificateSelectorPageProps {
  accessibleCertificates: string[];
  isLoggedIn: boolean;
}

export default function CertificateSelectorPage({
  accessibleCertificates,
  isLoggedIn,
}: CertificateSelectorPageProps) {
  const certificates = getAvailableCertificates();
  const defaultCert = getDefaultCertificate();

  if (!certificates || certificates.length === 0) {
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

  return (
    <section className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        <AllCertificationsGrid
          certificates={certificates}
          accessibleCertificates={accessibleCertificates}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </section>
  );
}

interface AllCertificationsGridProps {
  certificates: Certificate[];
  accessibleCertificates: string[];
  isLoggedIn: boolean;
}

function AllCertificationsGrid({
  certificates,
  accessibleCertificates,
  isLoggedIn,
}: AllCertificationsGridProps) {
  const { openPricingModal } = usePricingModal();
  const router = useRouter();
  const { handleStart } = useClientProvider();

  const hasAccess = (cert: Certificate): boolean => {
    return (
      accessibleCertificates.includes(cert.id) ||
      accessibleCertificates.includes(cert.slug)
    );
  };

  const handleCertificateClick = (cert: Certificate, e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      handleStart();
      return;
    }

    if (hasAccess(cert)) {
      router.push(`/${cert.slug}/levels`);
    } else {
      openPricingModal(cert.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-screen mb-10">
      {certificates.map((cert) => {
        const accessible = hasAccess(cert);
        const isLocked = isLoggedIn && !accessible;

        return (
          <div
            key={cert.slug}
            onClick={(e) => handleCertificateClick(cert, e)}
            className="block h-full cursor-pointer"
          >
            <div
              className={`certificate-card rounded-2xl p-6 h-[255px] flex flex-col transition-all duration-300 group relative ${
                isLocked
                  ? "hover:scale-105 opacity-90 hover:opacity-100"
                  : "hover:scale-105"
              }`}
            >
              {/* Lock overlay for locked certificates */}
              {isLocked && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-gray-800/90 rounded-full p-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight transition-colors">
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
                        className={`object-contain ${isLocked ? "grayscale-[30%]" : ""}`}
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
                  {!isLoggedIn ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-neutral-600"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Sign in to Access
                    </Button>
                  ) : isLocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock Certificate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-neutral-600"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Explore
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
