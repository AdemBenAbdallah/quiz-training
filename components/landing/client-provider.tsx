"use client";

import SignUp from "@/components/Signup";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

type ClientContextType = {
  handleStart: () => void;
  handleStartTrial: () => void;
  handleViewPricing: () => void;
  setOpenSignUp: (open: boolean) => void;
};

const ClientContext = createContext<ClientContextType | null>(null);

export function useClientProvider() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientProvider must be used within a ClientProvider");
  }
  return context;
}

export function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [openSignUp, setOpenSignUp] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    if (session) {
      router.push("/certificates");
    } else {
      setOpenSignUp(true);
    }
  };

  const handleStartTrial = () => {
    if (session) {
      router.push("/levels");
    } else {
      setOpenSignUp(true);
    }
  };

  const handleViewPricing = () => {
    router.push("/pricing");
  };

  return (
    <ClientContext.Provider
      value={{
        handleStart,
        handleStartTrial,
        handleViewPricing,
        setOpenSignUp,
      }}
    >
      {children}
      {openSignUp && (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black flex items-center justify-center">
          <SignUp />
        </div>
      )}
    </ClientContext.Provider>
  );
}
