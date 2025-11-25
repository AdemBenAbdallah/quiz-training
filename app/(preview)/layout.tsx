import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { Providers } from "@/components/providers";
import { getAnalyticsConfig } from "@/lib/analytics-config";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://awsquizgame.adembenabdallah.com/"),
  title: {
    default: "Quizzes Prepare for exams",
    template: `%s | Quizzes Prepare for exams`,
  },
  description:
    "The best Quiz app to prepare for aws developer exam  and improve your knowledge.",
  openGraph: {
    title: "Quizzes Prepare for exams",
    description:
      "The best Quiz app to prepare for exams and improve your knowledge.",
    url: absoluteUrl("/"),
    siteName: "Quizzes Prepare for exams",
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
