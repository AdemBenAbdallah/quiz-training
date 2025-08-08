"use client";

import useLocalStorage from "@/hook/useLocalStorage";
import { Lock } from "lucide-react";
import NextLink from "next/link";
import { QuizPart, QuizParts } from "./parts";

export default function HomePage() {
  const [quizParts, setQuizParts] = useLocalStorage<QuizPart[]>(
    "quizPart",
    QuizParts,
  );
  if (!quizParts) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-6 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center">Quiz AWS DVA-C02</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {quizParts.map((item, idx) => {
          const isLocked = !item.passed;
          return (
            <div key={idx} className="relative group">
              <NextLink
                href={!isLocked ? `/quiz/${idx + 1}` : "#"}
                className={`block relative rounded-2xl border bg-gradient-to-br from-background to-muted/40 shadow-md p-8 text-center transition-all duration-300 overflow-hidden
      ${
        !isLocked
          ? "hover:scale-[1.02] hover:shadow-xl hover:border-primary"
          : "cursor-not-allowed pointer-events-none opacity-70 locked-card"
      }
    `}
                style={{ minHeight: 200 }}
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                    {idx !== quizParts.length - 1
                      ? `Quiz Part ${idx + 1}`
                      : "Final Part of the Quiz"}
                  </div>
                  <div className="text-muted-foreground text-base mb-6 tracking-wide">
                    Questions {item.start + 1} - {item.end + 1}
                  </div>
                  <div className="flex justify-center">
                    <span
                      className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-300
            ${
              !isLocked
                ? "bg-primary text-black hover:bg-primary/90 hover:shadow-lg"
                : "bg-muted text-muted-foreground"
            }
          `}
                    >
                      {isLocked ? "Locked" : "Start"}
                    </span>
                  </div>
                </div>
              </NextLink>

              {isLocked && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <Lock className="text-white w-10 h-10 opacity-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
