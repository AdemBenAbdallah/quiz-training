import type { Metadata } from "next";
import { Suspense } from "react";
import TopLoader from "@/components/loading/TopLoader";
import QuizLevel from "@/components/QuizLevel";
import { getCertificateBySlug } from "@/lib/certificates";
import { absoluteUrl } from "@/lib/utils";

interface CertificateQuizPageProps {
	params: Promise<{ certificate: string; levelId: string }>;
}

export async function generateMetadata({
	params,
}: CertificateQuizPageProps): Promise<Metadata> {
	const { certificate, levelId } = await params;
	const cert = getCertificateBySlug(certificate);
	const levelNum = parseInt(levelId, 10);

	if (!cert) {
		return {
			title: "AWS Quiz | CertQuickly",
			description: "Practice questions for AWS certification exams.",
		};
	}

	const title = `${cert.name} - Level ${levelNum} Quiz | CertQuickly`;
	const description = `Practice ${cert.name} exam questions. Level ${levelNum} with comprehensive quiz to help you pass the certification.`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: absoluteUrl(`/quiz/${certificate}/level/${levelId}`),
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
		alternates: {
			canonical: `https://certquickly.com/quiz/${certificate}/level/${levelId}`,
		},
	};
}

export default async function CertificateQuizPage({
	params,
}: CertificateQuizPageProps) {
	const { certificate, levelId } = await params;

	return (
		<Suspense fallback={<TopLoader />}>
			<QuizLevel
				levelId={parseInt(levelId, 10)}
				certificateSlug={certificate}
			/>
		</Suspense>
	);
}
