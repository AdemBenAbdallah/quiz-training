import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { Providers } from "@/components/providers";
import { getAnalyticsConfig } from "@/lib/analytics-config";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://certquickly.com/"),
	title: {
		default:
			"Get AWS Certified in 7 Days | Fast AWS Certification - CertQuickly",
		template: "%s | Get AWS Certified Fast - CertQuickly",
	},
	description:
		"Pass your AWS Cloud Practitioner, Solutions Architect, or Developer exam in 1 week. Proven fast-track study method with 95% pass rate.",
	keywords: [
		"AWS certification",
		"AWS CLF-C02",
		"AWS SAA-C03",
		"fast AWS certification",
		"pass AWS exam quickly",
		"AWS training",
		"cloud certification",
		"AWS DVA-C02",
		"AWS SAP-C02",
		"get AWS certified fast",
	].join(", "),
	openGraph: {
		title: "Get AWS Certified in 7 Days | Fast AWS Certification - CertQuickly",
		description:
			"Pass your AWS Cloud Practitioner, Solutions Architect, or Developer exam in 1 week. Proven fast-track study method with 95% pass rate.",
		url: absoluteUrl("/"),
		siteName: "CertQuickly",
		images: [
			{
				url: absoluteUrl("/opengraph-image.png"),
				width: 1800,
				height: 1600,
				alt: "CertQuickly - AWS Certification Prep",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Get AWS Certified in 7 Days | Fast AWS Certification",
		description:
			"Pass your AWS Cloud Practitioner, Solutions Architect, or Developer exam in 1 week. 95% pass rate.",
		images: [absoluteUrl("/twitter-image.png")],
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: "https://certquickly.com",
	},
	verification: {
		google: "google-site-verification=placeholder", // Replace with actual verification code
	},
	category: "Education",
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
