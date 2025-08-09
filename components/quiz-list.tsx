"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { questionsSchema } from "@/lib/schemas";
import { experimental_useObject } from "ai/react";
import { FileUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import AddQuestionsDialog from "./AddQuestionsDialog";

type Quiz = {
  id: number;
  name: string;
  createdAt: Date | string | null;
  questionCount: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function QuizList() {
  const {
    data: quizzes = [],
    mutate,
    isLoading,
  } = useSWR<Quiz[]>("/api/quizzes", fetcher);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { submit, isLoading: isImporting } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    onError: (error) => {
      toast.error("Failed to add questions. Please try again.");
      setFiles([]);
    },
    onFinish: () => {
      toast.success("Successfully added new questions to the quiz!");
      setIsDialogOpen(false);
      setFiles([]);
      mutate(); // Re-fetch quizzes after import
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
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

  const handleImportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please upload a PDF file.");
      return;
    }
    if (!selectedQuiz) return;

    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    submit({ files: encodedFiles, quizId: selectedQuiz.id });
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center py-16">Loading quizzes...</div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizzes.map((quiz: Quiz) => (
            <Card key={quiz.id} borderBeam>
              <CardHeader>
                <CardTitle>{quiz.name}</CardTitle>
                <CardDescription>
                  Created on:{" "}
                  {quiz.createdAt
                    ? new Date(quiz.createdAt).toLocaleDateString()
                    : "-"}
                  <br />
                  Questions: {quiz.questionCount}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button asChild variant="secondary" className="w-full mr-2">
                  <Link href={`/quiz/${quiz.id}`}>Start Quiz</Link>
                </Button>
                <AddQuestionsDialog quizId={quiz.id} quizName={quiz.name} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <h2 className="text-xl font-semibold">No quizzes found</h2>
          <p className="text-muted-foreground mt-2">
            Get started by creating a new quiz.
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Questions</DialogTitle>
            <DialogDescription>
              Add more questions to &quot;{selectedQuiz?.name}&quot; by
              uploading another PDF.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportSubmit} className="space-y-4 py-4">
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
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
                  <span>Drop a PDF here or click to browse.</span>
                )}
              </p>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={files.length === 0 || isImporting}
              >
                {isImporting ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding Questions...</span>
                  </span>
                ) : (
                  "Add Questions"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
