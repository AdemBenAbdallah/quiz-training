"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-black to-black flex items-center justify-center p-4">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
              <AlertCircle className="relative h-32 w-32 text-red-500" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Oops! Something went wrong
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              {error.message || "An unexpected error occurred while loading your quiz."}
            </p>
          </div>

          {error.digest && (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
              <p className="text-sm text-gray-500 font-mono">
                Error ID: {error.digest}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              onClick={reset}
              size="lg"
              className="min-w-[160px] bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              size="lg"
              variant="outline"
              className="min-w-[160px] border-white/20 text-white hover:bg-white/10"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          <p className="text-sm text-gray-500 pt-8">
            If this problem persists, please contact support
          </p>
        </div>
      </Container>
    </div>
  );
}
