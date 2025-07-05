import Quiz from "@/components/quiz";
import data from "@/data.json";

// Helper to extract the correct answer letter from the answers array
const extractCorrectAnswer = (answersArr: string[]): string => {
  if (!answersArr || !answersArr.length) return "";
  const match = answersArr[0].match(/Selected Answer: ([A-D])/);
  return match ? match[1] : "";
};

export default function QuizPage() {
  // Transform data.json to Quiz format
  const quizQuestions = data.map((q: any) => ({
    question: q.question,
    options: q.choices.map((choice: string) =>
      choice.replace(/^([A-D]\.\s)/, "")
    ),
    answer: extractCorrectAnswer(q.answers) as "A" | "B" | "C" | "D"
  }));

  return (
    <div className="flex flex-col gap-4">
      <Quiz title="Quiz from data.json" questions={quizQuestions} />
    </div>
  );
}
