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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OptionWithSmallDescription {
  optionLabel: string;
  optionText: string;
  optionDescription: string;
}

interface ServiceInfoData {
  serviceName: string;
  serviceDescription: string;
  overallServiceSmallDescription: string;
  keyFeatures: string[];
  useCases: string[];
  optionsWithSmallDescriptions: OptionWithSmallDescription[];
}

type Props = {
  question: Question;
};

// Loading states to track different phases
type LoadingState = "initial" | "loading" | "cached" | "generated" | "error";

// Skeleton loader for service info modal
const ServiceInfoSkeleton: React.FC<{
  message: string;
  loadingState: LoadingState;
  question: Question;
}> = ({ message, loadingState, question }) => (
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
    <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
    <div className="h-20 w-full bg-muted rounded animate-pulse" />
    {/* Overall service small description skeleton */}
    <div className="h-12 w-full bg-muted rounded animate-pulse" />
    <div>
      <div className="h-6 w-32 bg-muted rounded mb-3 animate-pulse" />
      {/* Key features inline skeleton */}
      <div className="h-10 w-full bg-muted rounded animate-pulse" />
    </div>
    <div>
      <div className="h-6 w-24 bg-muted rounded mb-3 animate-pulse" />
      {/* Common use cases inline skeleton */}
      <div className="h-10 w-full bg-muted rounded animate-pulse" />
    </div>
    {/* Options with small descriptions skeleton */}
    <div>
      <div className="h-6 w-40 bg-muted rounded mb-3 animate-pulse" />
      <ul className="space-y-4">
        {[
          ...Array(question.options.length > 0 ? question.options.length : 3),
        ].map((_, i) => (
          <li key={i} className="space-y-2 p-2 rounded border bg-muted">
            <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ServiceInfoDialog: React.FC<Props> = ({ question }) => {
  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("initial");
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ServiceInfoData | null>(null);

  const lastLoadedQuestion = useRef<string | null>(null);

  const fetchServiceInfo = useCallback(async () => {
    setLoadingState("loading");
    setLoadingMessage("Fetching service information...");
    setError(null);

    try {
      const res = await fetch("/api/service-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get service information");
      }

      const json = await res.json();
      setData(json);
      setLoadingState("initial");
    } catch (err: any) {
      setError(err.message || "Failed to get service information");
      setLoadingState("error");
      setLoadingMessage("❌ Error fetching service information");
    }
  }, [question.question, question.options]);

  useEffect(() => {
    if (open && lastLoadedQuestion.current !== question.question) {
      fetchServiceInfo();
      lastLoadedQuestion.current = question.question;
    }
  }, [open, question.question, fetchServiceInfo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Learn about the AWS service in this question"
                tabIndex={0}
                className="ml-2 p-2 rounded-full hover:bg-accent hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 ease-in-out group relative"
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setOpen(true);
                }}
              >
                <BadgeInfo className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors duration-200" />
                <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Service Info</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[700px] w-full sm:max-w-lg md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AWS Service Information</DialogTitle>
          <DialogDescription>
            Learn about the AWS service mentioned in this question and its
            options.
          </DialogDescription>
        </DialogHeader>

        {loadingState !== "initial" && (
          <ServiceInfoSkeleton
            message={loadingMessage}
            loadingState={loadingState}
            question={question}
          />
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 py-4">
            <span>❌</span>
            {error}
          </div>
        )}

        {loadingState === "initial" && data && (
          <div className="space-y-6 ">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                {data.serviceName}
              </h3>
              {/* Display overall service small description */}
              {data.overallServiceSmallDescription && (
                <p className="text-lg font-medium text-foreground mb-4">
                  {data.overallServiceSmallDescription}
                </p>
              )}
              <p className="text-muted-foreground leading-relaxed">
                {data.serviceDescription}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-foreground">
                Key Features
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.keyFeatures.map((feature, i) => (
                  <React.Fragment key={i}>
                    {feature}
                    {i < data.keyFeatures.length - 1 && ", "}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-foreground">
                Common Use Cases
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.useCases.map((useCase, i) => (
                  <React.Fragment key={i}>
                    {useCase}
                    {i < data.useCases.length - 1 && ", "}
                  </React.Fragment>
                ))}
              </p>
            </div>

            {/* New section for options with small descriptions */}
            {data.optionsWithSmallDescriptions &&
              data.optionsWithSmallDescriptions.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-foreground">
                    Options Explained
                  </h4>
                  <ul className="space-y-4">
                    {data.optionsWithSmallDescriptions.map((option, i) => (
                      <li key={i} className="p-2 rounded border bg-muted">
                        <p className="text-base mb-1">
                          <span className="font-bold text-primary">
                            {option.optionLabel}.
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {option.optionText}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                          {option.optionDescription}
                        </p>
                      </li>
                    ))}
                  </ul>
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

export default ServiceInfoDialog;
