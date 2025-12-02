import TopLoader from "@/components/loading/TopLoader";
import QuizLevel from "@/components/QuizLevel";
import { Suspense } from "react";

interface CertificateQuizPageProps {
  params: Promise<{ certificate: string; levelId: string }>;
}

export default async function CertificateQuizPage({ params }: CertificateQuizPageProps) {
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