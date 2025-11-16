import LevelProgress from "@/components/LevelProgress";
import TopLoader from "@/components/loading/TopLoader";
import { Suspense } from "react";

interface LevelPageProps {
  params: Promise<{ id: string }>;
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { id } = await params;
  const levelId = id ? parseInt(id, 10) : 0;

  return (
    <Suspense fallback={<TopLoader />}>
      <LevelProgress levelId={levelId} />
    </Suspense>
  );
}
