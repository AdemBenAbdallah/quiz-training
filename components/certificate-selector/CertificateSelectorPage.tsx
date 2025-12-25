"use client";

import { usePricingModal } from "@/components/pricing";
import { Button } from "@/components/ui/button";
import { getAvailableCertificates } from "@/lib/certificates";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-8">
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
              className={`certificate-card rounded-2xl p-3 sm:p-4 flex flex-col transition-all duration-300 group relative h-full min-h-[200px] sm:min-h-[240px] ${
                isLocked
                  ? "hover:scale-105 opacity-90 hover:opacity-100"
                  : "hover:scale-105"
              }`}
            >
              {/* Lock overlay for locked certificates */}
              {isLocked && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-gray-800/90 rounded-full p-1.5">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="flex flex-col h-full gap-2 sm:gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 sm:gap-3 flex-shrink-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 leading-tight transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2">
                      {cert.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="cert-badge w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform duration-300">
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
                                <Award class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Spacer to push stats and button to bottom on larger screens */}
                <div className="hidden sm:flex-1"></div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-bold text-white">
                      {cert.totalLevels}
                    </div>
                    <div className="text-[9px] sm:text-xs text-gray-400">
                      Levels
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm sm:text-base font-bold text-white">
                      {cert.totalLevels * 8}h
                    </div>
                    <div className="text-[9px] sm:text-xs text-gray-400">
                      Study Time
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-1 sm:pt-2 flex-shrink-0">
                  {!isLoggedIn ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-neutral-600 text-[10px] sm:text-xs py-1.5 sm:py-2 h-8 sm:h-9"
                    >
                      <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      <span className="hidden sm:inline">
                        Sign in to Access
                      </span>
                      <span className="sm:hidden">Sign In</span>
                    </Button>
                  ) : isLocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-[10px] sm:text-xs py-1.5 sm:py-2 h-8 sm:h-9"
                    >
                      <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      Unlock
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-neutral-600 text-[10px] sm:text-xs py-1.5 sm:py-2 h-8 sm:h-9"
                    >
                      <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
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
