"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
      <div className="relative">
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold">AWS Quiz</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </div>

              <Button
                onClick={() => router.push("/signup")}
                className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-4 text-md rounded-xl transition-all duration-200 hover:scale-105"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">
                  Pass the AWS Developer Associate Exam —{" "}
                  <span className="text-orange-400 underline decoration-orange-400/30 underline-offset-8">
                    Or Get Your Money Back
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed text-pretty">
                  Gamified learning that actually works. Complete all levels,
                  master AWS concepts, and pass with confidence.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-8 py-4 text-xl rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Start Learning - $30
                </Button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-black flex items-center justify-center text-xs font-bold text-black"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex text-orange-400 text-sm">
                      {"★".repeat(5)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Join 1,200+ developers preparing for AWS certification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl transition-all duration-500"></div>

              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                100% Money Back
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
