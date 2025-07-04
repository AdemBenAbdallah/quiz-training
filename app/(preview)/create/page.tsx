"use client";

import BackButton from "@/components/BackButton";
import Quiz from "@/components/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { questionNumber, questionsSchema } from "@/lib/schemas";
import { experimental_useObject } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateQuizPage() {
  const [quizName, setQuizName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    []
  );
  const [isDragging, setIsDragging] = useState(false);

  const {
    submit,
    object: partialQuestions,
    isLoading
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
      setIsCreating(false);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
      setIsCreating(false);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }
    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload a PDF file.");
      return;
    }
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file)
      }))
    );
    submit({ files: encodedFiles, name: quizName });
  };

  const progress = partialQuestions
    ? (partialQuestions.length / questionNumber) * 100
    : 0;

  if (questions.length === questionNumber) {
    return <Quiz title={quizName} questions={questions} />;
  }

  if (isCreating) {
    return (
      <div
        className="min-h-[100dvh] w-full flex justify-center"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragExit={() => setIsDragging(false)}
        onDragEnd={() => setIsDragging(false)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileChange({
            target: { files: e.dataTransfer.files }
          } as React.ChangeEvent<HTMLInputElement>);
        }}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>Drag and drop files here</div>
              <div className="text-sm dark:text-zinc-400 text-zinc-500">
                {"(PDFs only)"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitWithFiles} className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {files.length > 0 ? (
                    <span className="font-medium text-foreground">
                      {files[0].name}
                    </span>
                  ) : (
                    <span>Drop your PDF here or click to browse.</span>
                  )}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={files.length === 0 || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Quiz...</span>
                  </span>
                ) : (
                  "Generate Quiz"
                )}
              </Button>
            </form>
          </CardContent>
          {isLoading && (
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="w-full space-y-2">
                <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isLoading ? "bg-yellow-500/50 animate-pulse" : "bg-muted"
                    }`}
                  />
                  <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
                    {partialQuestions
                      ? `Generating question ${
                          partialQuestions.length + 1
                        } of 4`
                      : "Analyzing PDF content"}
                  </span>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex gap-4">
            <BackButton href="/" />
            <Button>Create a New Quiz</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Quiz</DialogTitle>
            <DialogDescription>
              Please enter a name for your new quiz.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="e.g., 'History of Ancient Rome'"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (quizName.trim()) {
                  setIsCreating(true);
                  setIsDialogOpen(false);
                } else {
                  toast.error("Please enter a quiz name.");
                }
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
