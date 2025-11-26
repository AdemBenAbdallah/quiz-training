import TopLoader from "@/components/loading/TopLoader";
import QuizPartV2 from "@/components/QuizPartV2";
import { Suspense } from "react";

interface CertificateQuizPageProps {
  params: Promise<{ certificate: string; id: string; levelId: string }>;
}

export default async function CertificateQuizPage({ params }: CertificateQuizPageProps) {
  const { certificate, id, levelId } = await params;

  return (
    <Suspense fallback={<TopLoader />}>
      <QuizPartV2 
        levelId={parseInt(levelId, 10)} 
        partId={parseInt(id, 10)} 
        certificateSlug={certificate}
      />
    </Suspense>
  );
}