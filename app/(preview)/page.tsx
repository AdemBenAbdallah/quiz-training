"use client";

import data from "@/data.json";
import NextLink from "next/link";

const QUESTIONS_PER_PART = 10;

export default function HomePage() {
  const numParts = Math.ceil(data.length / QUESTIONS_PER_PART);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Quiz AWS DVA-C02</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {Array.from({ length: numParts }).map((_, idx) => {
          const start = idx * QUESTIONS_PER_PART + 1;
          const end = Math.min((idx + 1) * QUESTIONS_PER_PART, data.length);
          return (
            <NextLink
              key={idx}
              href={`/quiz/${idx + 1}`}
              className="block rounded-2xl border border-muted bg-gradient-to-br from-background to-muted/40 shadow-md hover:shadow-xl hover:border-primary transition-all duration-200 p-8 text-center group scale-100 hover:scale-105"
              style={{ minHeight: 200 }}
            >
              <div className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                Quiz Part {idx + 1}
              </div>
              <div className="text-muted-foreground text-base mb-6 tracking-wide">
                Questions {start} - {end}
              </div>
              <div className="flex justify-center">
                <span className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow group-hover:bg-primary/90 group-hover:shadow-lg transition-all duration-200 cursor-pointer">
                  Start
                </span>
              </div>
            </NextLink>
          );
        })}
      </div>
    </div>
  );
}
