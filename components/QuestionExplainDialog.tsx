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
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

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

const fetcher = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to get explanation");
  }
  return res.json();
};

const QuestionExplainDialog: React.FC<Props> = ({ question }) => {
  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("initial");
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const payload = {
    question: question.question,
    options: question.options,
    answer: Array.isArray(question.answer)
      ? question.answer
      : [question.answer],
  };

  const key: [string, typeof payload] = ["/api/explain-question", payload];

  const { data, error, isLoading } = useSWR<ExplainData>(
    open ? key : null,
    ([url, body]) => fetcher(url, body),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 60 seconds
    },
  );

  // control skeleton state
  useEffect(() => {
    if (isLoading) {
      setLoadingState("loading");
      setLoadingMessage("Generating explanation...");
    } else if (error) {
      setLoadingState("error");
      setLoadingMessage(`❌ ${error.message}`);
    } else if (data) {
      setLoadingState("cached");
      setLoadingMessage("✅ Explanation loaded");
      // Clear the message after a short delay
      setTimeout(() => setLoadingState("initial"), 1000);
    }
  }, [isLoading, error, data]);

  // Trigger fetch when dialog opens
  useEffect(() => {
    if (open && !data && !isLoading) {
      setLoadingState("loading");
      setLoadingMessage("Generating explanation...");
    }
  }, [open, data, isLoading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Explain this question"
          className="w-full max-w-xs mx-auto block"
          onClick={() => setOpen(true)}
        >
          Get Answer
        </Button>
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
            {error.message}
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
