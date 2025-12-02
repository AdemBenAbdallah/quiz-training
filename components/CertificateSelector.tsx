"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="space-y-6 px-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Choose Your Certification Path
        </h2>
        <p className="text-gray-600">
          Select a certification to start your preparation journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                {cert.slug === defaultCert?.slug && (
                  <Badge variant="secondary">Popular</Badge>
                )}
              </div>

              <p className="text-gray-600 text-sm">{cert.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {cert.totalLevels} levels
                </span>
                {cert.isActive ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline">Coming Soon</Badge>
                )}
              </div>

              <Button
                asChild
                className="w-full"
                variant={
                  currentCertificate === cert.slug ? "default" : "outline"
                }
              >
                <Link href={`/${cert.slug}/levels`}>
                  {currentCertificate === cert.slug
                    ? "Current Path"
                    : "Start Learning"}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
