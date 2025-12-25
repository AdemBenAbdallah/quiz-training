"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface PricingContextState {
  isOpen: boolean;
  preselectedCertificateId: string | null;
  openPricingModal: (certificateId?: string) => void;
  closePricingModal: () => void;
}

const PricingContext = createContext<PricingContextState | null>(null);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedCertificateId, setPreselectedCertificateId] = useState<string | null>(null);

  const openPricingModal = useCallback((certificateId?: string) => {
    setPreselectedCertificateId(certificateId ?? null);
    setIsOpen(true);
  }, []);

  const closePricingModal = useCallback(() => {
    setIsOpen(false);
    setPreselectedCertificateId(null);
  }, []);

  return (
    <PricingContext.Provider
      value={{
        isOpen,
        preselectedCertificateId,
        openPricingModal,
        closePricingModal,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricingModal(): PricingContextState {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricingModal must be used within a PricingProvider");
  }
  return context;
}
