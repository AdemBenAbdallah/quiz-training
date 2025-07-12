import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { BadgeInfo } from "lucide-react";
import React, { useState } from "react";
import type { Question } from "./quiz";

// Types for the explanation data
interface ExplainData {
  explanation: string;
  choices: Array<{ label: string; text: string; explanation: string }>;
  correctAnswer: string;
  correctExplanation: string;
  trick: string;
}

type Props = {
  question: Question;
};

// Skeleton loader for explanation modal
const QuestionExplainSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse" aria-busy="true">
    <div className="h-6 w-1/2 bg-muted rounded" />
    <div className="h-4 w-1/3 bg-muted rounded" />
    <div>
      <div className="h-4 w-24 bg-muted rounded mb-2" />
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <li
            key={i}
            className="p-2 rounded border bg-muted/60 flex flex-col gap-2"
          >
            <div className="h-4 w-1/6 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted/80 rounded" />
          </li>
        ))}
      </ul>
    </div>
    <div className="h-4 w-1/4 bg-muted rounded mt-4" />
    <div className="h-3 w-1/2 bg-muted/80 rounded" />
  </div>
);

const QuestionExplainDialog: React.FC<Props> = ({ question }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplainData | null>(null);

  const handleOpenExplain = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/explain-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          answer: question.answer
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get explanation");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to get explanation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Explain this question"
          tabIndex={0}
          className="ml-2 p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={handleOpenExplain}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpenExplain();
          }}
        >
          <BadgeInfo className="w-6 h-6 text-primary" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Question Explanation</DialogTitle>
          <DialogDescription>
            Beginner-friendly explanation for this question and its choices.
          </DialogDescription>
        </DialogHeader>
        {loading && <QuestionExplainSkeleton />}
        {error && <div className="text-red-600 py-4">{error}</div>}
        {data && (
          <div className="space-y-4">
            <div className="font-semibold">{data.explanation}</div>
            <div>
              <div className="font-semibold mb-2">Choices:</div>
              <ul className="space-y-2">
                {data.choices.map((c, i) => (
                  <li key={i} className="p-2 rounded border bg-muted">
                    <span className="font-bold mr-2">{c.label}.</span>
                    <span className="font-medium">{c.text}</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {c.explanation}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="font-semibold mt-4">
              Correct Answer:{" "}
              <span className="text-green-600">{data.correctAnswer}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {data.correctExplanation}
            </div>
            {data.trick && (
              <div className="mt-6 p-4 rounded bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M6.34 6.34l-.71-.71M17 12a5 5 0 10-10 0c0 2.5 2 4.5 4 4.5s4-2 4-4.5z"
                  />
                </svg>
                <div>
                  <div className="font-semibold text-yellow-700">Trick</div>
                  <div className="text-yellow-800 text-sm">{data.trick}</div>
                </div>
              </div>
            )}
          </div>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="mt-6 w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionExplainDialog;
