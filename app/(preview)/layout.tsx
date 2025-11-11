import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  // metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "Quizzes Prepare for exams",
  description: "Quizzes Prepare for exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
