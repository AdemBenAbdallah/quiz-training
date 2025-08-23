import { quizLevelNumber } from "@/types/quiz";

export default function QuizzesPage() {
  return (
    <div className="container mx-auto py-8">
      {Array.from({ length: quizLevelNumber }, (_, i) => (
        <div key={i + 1}>Level {i + 1}</div>
      ))}
    </div>
  );
}
