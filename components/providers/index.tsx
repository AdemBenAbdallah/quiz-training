"use client";

import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
      <Toaster position="top-center" richColors />
      {children}
    </ThemeProvider>
  );
}
