import { redirect } from "next/navigation";

interface LevelPageProps {
  params: Promise<{ id: string }>;
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { id } = await params;
  const levelId = id ? parseInt(id, 10) : 0;

  // Redirect old level page to new quiz structure
  redirect(`/quiz/${levelId}`);
}
