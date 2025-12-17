"use client";

import PublicQuiz from "@/components/PublicQuiz";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useClientProvider } from "./client-provider";

export default function Hero() {
  const { handleStart } = useClientProvider();
  return (
    <section className="container mx-auto px-4 py-24 space-y-12">
      <div className="space-y-8 text-center">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-balance !leading-[1.2]">
            Get your <span className="bg-red-700">certification in days</span>{" "}
            <br />
            instead of weeks
          </h1>
          <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed text-pretty max-w-6xl">
            Master AWS certifications faster with our proven study system. Get
            detailed explanations, practice questions, and progress tracking to
            accelerate your learning journey.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleStart}
            size="lg"
            className="font-semibold px-8 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start preparing
          </Button>
        </div>
      </div>

      <Container>
        <PublicQuiz handleStart={handleStart} />
      </Container>
    </section>
  );
}
