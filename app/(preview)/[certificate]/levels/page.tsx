import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CertificateLevels from "@/components/CertificateLevels";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import { auth } from "@/lib/auth";
import { getCertificateBySlug } from "@/lib/certificates";
import { absoluteUrl, generateCertificateDescription } from "@/lib/utils";

interface CertificateLevelsPageProps {
	params: Promise<{ certificate: string }>;
}

export async function generateMetadata({
	params,
}: CertificateLevelsPageProps): Promise<Metadata> {
	const { certificate } = await params;
	const cert = getCertificateBySlug(certificate);

	if (!cert) {
		return {
			title: "AWS Certification | CertQuickly",
			description:
				"Prepare for AWS certification exams with fast-track study methods.",
		};
	}

	const title = `${cert.name} Fast Track | Pass in 7 Days - CertQuickly`;
	const description = generateCertificateDescription(cert.name);

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: absoluteUrl(`/${certificate}/levels`),
			type: "website",
			images: [
				{
					url: absoluteUrl("/opengraph-image.png"),
					width: 1800,
					height: 1600,
					alt: `${cert.name} Certification Prep`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
		alternates: {
			canonical: `https://certquickly.com/${certificate}/levels`,
		},
	};
}

export default async function CertificateLevelsPage({
	params,
}: CertificateLevelsPageProps) {
	const { certificate } = await params;

	// Validate certificate exists
	const cert = getCertificateBySlug(certificate);
	if (!cert) {
		redirect("/certificates");
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<ClientProvider session={session}>
			<div className="relative min-h-screen text-white">
				<div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
				<div className="relative">
					<CertificateLevels certificateSlug={certificate} />
					<Suspense fallback={<div>Loading...</div>}>
						<Footer />
					</Suspense>
				</div>
			</div>
		</ClientProvider>
	);
}
