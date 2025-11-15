import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizzes Prepare for exams",
  description: "Quizzes Prepare for exams",
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

        {/* ✅ Google Ads Global Tag */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-17695424239"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17695424239');
          `}
        </Script>

        {/*DataFast*/}
        <Script
          data-website-id="dfid_eTpQ5NjrKpI9SsZkJ4rgy"
          data-domain="awsquizgame.adembenabdallah.com"
          src="https://datafa.st/js/script.js"
          strategy="afterInteractive"
          data-allow-localhost="true"
        />
      </body>
    </html>
  );
}
