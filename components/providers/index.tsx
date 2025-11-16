import { Suspense, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import TopLoader from "../loading/TopLoader";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
      <Toaster position="top-center" richColors />
      <Suspense fallback={<TopLoader />}>{children}</Suspense>
    </ThemeProvider>
  );
}
