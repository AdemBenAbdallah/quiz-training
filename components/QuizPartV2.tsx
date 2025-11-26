"use client";

import { QuizParts } from "@/app/(preview)/parts";
import Quiz from "@/components/quiz";
import { cleanOptions } from "@/lib/explain-utils";
import { loadCertificateLevel } from "@/lib/certificates";
import { quizLevels } from "@/public/quiz";
import { useState, useEffect } from "react";

interface QuizPartProps {
  levelId: number;
  partId: number;
  certificateSlug?: string; // Optional for backward compatibility
}

const extractQuestionNumber = (questionNumberStr: string): string => {
  const match = questionNumberStr.match(/Question #:\s*(\d+)/);
  return match ? `Question: ${match[1]}` : "";
};

export default function QuizPartV2({ levelId, partId, certificateSlug }: QuizPartProps) {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="flex justify-center items-center min-h-64">Loading quiz...</div>;
  }

  const level = levelId || 1;
  const part = partId || 1;

  const { data: quizParts } = QuizParts(level);

  const startIdx = quizParts[part - 1]?.start || 0;
  const endIdx = quizParts[part - 1]?.end || 0;

  const quizQuestions = quizData.slice(startIdx, endIdx).map((q: any) => {
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
        idx={part}
        levelId={levelId}
        title={`Quiz Part ${part}`}
        questions={quizQuestions}
      />
    </div>
  );
}