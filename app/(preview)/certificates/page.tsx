import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import CertificateSelectorPage from "@/components/certificate-selector/CertificateSelectorPage";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import { PricingModal, PricingProvider } from "@/components/pricing";
import { auth } from "@/lib/auth";
import { getUserAccessibleCertificates } from "@/lib/server/payment";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
	title: "All AWS Certifications | Fast Track Courses - CertQuickly",
	description:
		"Explore our complete catalog of AWS certification preparation courses. Pass your AWS Cloud Practitioner, Solutions Architect, Developer, or Specialty exam in 7 days with our proven fast-track study method.",
	openGraph: {
		title: "All AWS Certifications | Fast Track Courses - CertQuickly",
		description:
			"Explore our complete catalog of AWS certification preparation courses. Pass your AWS exam in 7 days.",
		url: absoluteUrl("/certificates"),
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "All AWS Certifications | Fast Track Courses",
		description:
			"Explore our complete catalog of AWS certification preparation courses.",
	},
	alternates: {
		canonical: "https://certquickly.com/certificates",
	},
};

export default async function CertificatesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Get user's accessible certificates if logged in
	const accessibleCertificates = session?.user?.id
		? await getUserAccessibleCertificates(session.user.id)
		: [];

	return (
		<ClientProvider session={session}>
			<PricingProvider>
				<div className="relative min-h-screen text-white">
					<div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
					<div className="relative container mx-auto px-4 py-16">
						<Suspense fallback={<div>Loading...</div>}>
							<div className="space-y-12">
								{/* Enhanced Header Section */}
								<div className="text-center space-y-8">
									{/* Breadcrumb Navigation */}
									<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
										<Link
											href="/"
											className="hover:text-gray-200 transition-colors duration-200"
										>
											Home
										</Link>
										<span className="text-gray-600">/</span>
										<span className="text-gray-200 font-medium">
											Certificates
										</span>
									</div>

									{/* Main Title */}
									<div className="space-y-4">
										<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
											<span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
												All Certifications
											</span>
										</h1>
									</div>

									{/* Enhanced Subtitle */}
									<p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-light">
										Explore our complete catalog of{" "}
										<span className="text-red-500 font-medium">
											AWS certification preparation
										</span>{" "}
										courses designed to accelerate your cloud career
									</p>
								</div>

								<CertificateSelectorPage
									accessibleCertificates={accessibleCertificates}
									isLoggedIn={!!session?.user}
								/>
							</div>
						</Suspense>
						<Suspense fallback={<div>Loading...</div>}>
							<Footer />
						</Suspense>
					</div>
				</div>
				<PricingModal />
			</PricingProvider>
		</ClientProvider>
	);
}
