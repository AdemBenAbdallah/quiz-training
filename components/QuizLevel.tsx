"use client";

import Quiz from "@/components/quiz";
import { loadCertificateLevel } from "@/lib/certificates";
import { cleanOptions } from "@/lib/explain-utils";
import { quizLevels } from "@/public/quiz";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QuizLevelProps {
  levelId: number;
  certificateSlug?: string; // Optional for backward compatibility
}

const extractQuestionNumber = (questionNumberStr: string): string => {
  const match = questionNumberStr.match(/Question #:\s*(\d+)/);
  return match ? `Question: ${match[1]}` : "";
};

export default function QuizLevel({
  levelId,
  certificateSlug,
}: QuizLevelProps) {
  const router = useRouter();
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    if (certificateSlug) {
      router.push(`/${certificateSlug}/levels`);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        let data: any[] = [];

        if (certificateSlug) {
          // Load from new certificate structure
          data = await loadCertificateLevel(certificateSlug, levelId);
        } else {
          // Fallback to legacy structure for backward compatibility
          data = quizLevels[levelId - 1] || [];
        }

        setQuizData(data);
      } catch (error) {
        console.error("Failed to load quiz data:", error);
        setQuizData([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [levelId, certificateSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        Loading quiz...
      </div>
    );
  }

  const quizQuestions = quizData.map((q: any) => {
    const rawChoices = q.choices;
    const limited = rawChoices.slice(0, 5);
    return {
      questionNumber: extractQuestionNumber(q.question_number),
      question: q.question,
      options: cleanOptions(limited),
      answer: q.answers,
      answerComments: q.answers,
      multipleAnswers: q.answers.length > 1,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <Quiz
        levelId={levelId}
        title={`Level ${levelId}`}
        questions={quizQuestions}
        onBack={handleBack}
      />
    </div>
  );
}
