"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import NextLink from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center">
      <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              PDF Quiz Generator
            </CardTitle>
            <CardDescription className="text-base">
              Create and take quizzes from your PDF files.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NextLink href="/create" passHref>
            <Button className="w-full">Create a New Quiz</Button>
          </NextLink>
          <NextLink href="/quizzes" passHref>
            <Button variant="outline" className="w-full">
              View All Quizzes
            </Button>
          </NextLink>
          <NextLink href="/history" passHref>
            <Button variant="outline" className="w-full">
              History
            </Button>
          </NextLink>
        </CardContent>
      </Card>
    </div>
  );
}
