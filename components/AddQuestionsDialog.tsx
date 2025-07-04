"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { questionsSchema } from "@/lib/schemas";
import { experimental_useObject } from "ai/react";
import { FileUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type AddQuestionsDialogProps = {
  quizId: number;
  quizName: string;
};

const AddQuestionsDialog = ({ quizId, quizName }: AddQuestionsDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { submit, isLoading } = experimental_useObject({
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

  const handleImportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    submit({ files: encodedFiles, quizId });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="Import questions" tabIndex={0}>
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Questions</DialogTitle>
          <DialogDescription>
            Add more questions to &quot;{quizName}&quot; by uploading a PDF.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleImportSubmit} className="space-y-4 py-4">
          <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload PDF"
              tabIndex={0}
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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={files.length === 0 || isLoading}
              aria-label="Add Questions"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding Questions...</span>
                </span>
              ) : (
                "Add Questions"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionsDialog;
