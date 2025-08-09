import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Question } from "@/types/quiz";
import { BadgeInfo, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

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

// Loading states to track different phases
type LoadingState = "initial" | "loading" | "cached" | "generated" | "error";

// Skeleton loader for explanation modal
const QuestionExplainSkeleton: React.FC<{
  message: string;
  loadingState: LoadingState;
}> = ({ message, loadingState }) => (
  <div className="space-y-4" aria-busy="true">
    <div className="flex items-center gap-2 mb-4">
      {loadingState === "loading" && (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      )}
      <div
        className={`text-sm ${
          loadingState === "cached"
            ? "text-green-600"
            : loadingState === "generated"
              ? "text-blue-600"
              : "text-muted-foreground"
        }`}
      >
        {message}
      </div>
    </div>
    <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
    <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
    <div>
      <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse" />
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <li
            key={i}
            className="p-2 rounded border bg-muted/60 flex flex-col gap-2"
          >
            <div className="h-4 w-1/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted/80 rounded animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
    <div className="h-4 w-1/4 bg-muted rounded mt-4 animate-pulse" />
    <div className="h-3 w-1/2 bg-muted/80 rounded animate-pulse" />
  </div>
);

const QuestionExplainDialog: React.FC<Props> = ({ question }) => {
  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("initial");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExplainData | null>(null);

  const lastLoadedQuestion = useRef<string | null>(null);

  const fetchExplanation = async () => {
    setLoadingState("loading");
    setLoadingMessage("Fetching explanation...");
    setError(null);

    const startTime = Date.now();

    try {
      const res = await fetch("/api/explain-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          answer: Array.isArray(question.answer)
            ? question.answer
            : [question.answer],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get explanation");
      }

      const json = await res.json();
      setData(json);

      // If response was fast (< 1s), it was likely cached
      const responseTime = Date.now() - startTime;
      if (responseTime < 1000) {
        setLoadingState("cached");
        setLoadingMessage("✨ Retrieved from cache");
      } else {
        setLoadingState("generated");
        setLoadingMessage("🤖 Generated new explanation");
      }

      // Show loading state briefly before showing content
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoadingState("initial");
    } catch (err: any) {
      setError(err.message || "Failed to get explanation");
      setLoadingState("error");
      setLoadingMessage("❌ Error fetching explanation");
    }
  };

  useEffect(() => {
    if (open && lastLoadedQuestion.current !== question.question) {
      fetchExplanation();
      lastLoadedQuestion.current = question.question;
    }
  }, [open, question.question, fetchExplanation]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Explain this question"
          tabIndex={0}
          className="ml-2 p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(true);
          }}
        >
          <BadgeInfo className="w-6 h-6 text-primary" />
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[700px] w-full sm:max-w-lg md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Question Explanation</DialogTitle>
          <DialogDescription>
            Beginner-friendly explanation for this question and its choices.
          </DialogDescription>
        </DialogHeader>

        {loadingState !== "initial" && (
          <QuestionExplainSkeleton
            message={loadingMessage}
            loadingState={loadingState}
          />
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 py-4">
            <span>❌</span>
            {error}
          </div>
        )}

        {loadingState === "initial" && data && (
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
