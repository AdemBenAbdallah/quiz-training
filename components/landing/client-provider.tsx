"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
import SignUp from "@/components/Signup";

type ClientContextType = {
  handleStart: () => void;
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
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  const [openSignUp, setOpenSignUp] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    session ? router.push("/levels") : setOpenSignUp(true);
  };

  return (
    <ClientContext.Provider value={{ handleStart, setOpenSignUp }}>
      {children}
      {openSignUp && (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black flex items-center justify-center">
          <SignUp />
        </div>
      )}
    </ClientContext.Provider>
  );
}
