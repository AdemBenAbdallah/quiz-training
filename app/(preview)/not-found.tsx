import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Search, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-black to-black flex items-center justify-center p-4">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
              <div className="relative">
                <Search className="h-32 w-32 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              We couldn&apos;t find the page you&apos;re looking for. It might have
              been moved, deleted, or never existed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              asChild
              size="lg"
              className="min-w-[160px] bg-red-600 hover:bg-red-700 text-white"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[160px] border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/certificates">
                <BookOpen className="mr-2 h-4 w-4" />
                View Certificates
              </Link>
            </Button>
          </div>

          <div className="pt-8 space-y-4">
            <p className="text-sm text-gray-500">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/certificates" className="text-red-500 hover:text-red-400">
                Browse Certifications
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/level/1" className="text-red-500 hover:text-red-400">
                Take a Quiz
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/" className="text-red-500 hover:text-red-400">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
