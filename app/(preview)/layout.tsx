import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { Providers } from "@/components/providers";
import { getAnalyticsConfig } from "@/lib/analytics-config";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://certquickly.com/"),
  title: {
    default: "CertQuickly - AWS Certification Prep",
    template: `%s | CertQuickly - AWS Certification Prep`,
  },
  description:
      "The best platform to prepare for AWS certification exams and improve your cloud knowledge with CertQuickly.",
  openGraph: {
    title: "CertQuickly - AWS Certification Prep",
    description:
    "The best platform to prepare for AWS certification exams and improve your cloud knowledge with CertQuickly.",
    url: absoluteUrl("/"),
    siteName: "CertQuickly - AWS Certification Prep",
    images: [
      {
        url: absoluteUrl("/opengraph-image.png"),
        width: 1800,
        height: 1600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzes Prepare for exams",
    description:
      "The best Quiz app to prepare for exams and improve your knowledge.",
    images: [absoluteUrl("/twitter-image.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.className}>
      <body>
        <Providers>{children}</Providers>

        {/* 📊 All Analytics Scripts */}
        <AnalyticsScripts
          {...getAnalyticsConfig()}
          debug={process.env.NODE_ENV === "development"}
        />
      </body>
    </html>
  );
}
