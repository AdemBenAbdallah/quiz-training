import BackButton from "@/components/BackButton";
import QuizList from "@/components/quiz-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuizzesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Quizzes</h1>
        <div className="flex gap-4">
          <BackButton href="/" />
          <Button asChild>
            <Link href="/create">Create New Quiz</Link>
          </Button>
        </div>
      </div>
      <QuizList />
    </div>
  );
}
