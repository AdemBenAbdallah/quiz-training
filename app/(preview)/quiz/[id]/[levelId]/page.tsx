import QuizPart from "@/components/QuizPart";
import { Suspense } from "react";

interface QuizPageProps {
  params: Promise<{ id: string; levelId: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id, levelId } = await params;

  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizPart levelId={parseInt(levelId, 10)} partId={parseInt(id, 10)} />
    </Suspense>
  );
}
