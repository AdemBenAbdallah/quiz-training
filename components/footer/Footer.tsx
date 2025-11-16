"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import Image from "next/image";
import { useClientProvider } from "../landing/client-provider";

export default function Footer() {
  const { handleStart } = useClientProvider();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="AWS Quiz Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-white">AWS Exam</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Master the AWS Certified Developer Associate (DVA-C02) exam with
              our gamified learning platform. 500+ practice questions with
              detailed explanations.
            </p>
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-5 h-5 text-red-500" />
              <a
                href="mailto:adembenabdallah.contact@gmail.com"
                className="hover:text-white transition-colors duration-200"
              >
                adembenabdallah.contact@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection("how")}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                FAQ
              </button>
              <button
                onClick={handleStart}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Start Free Trial
              </button>
            </nav>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">
              Ready to Start?
            </h3>
            <p className="text-gray-400 text-sm">
              Join thousands of developers who&apos;ve passed their AWS
              certification.
            </p>
            <Button
              onClick={handleStart}
              className="w-full bg-white text-black font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Start Free Trial
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-gray-500 text-center">
              14-day free trial • No credit card required
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} AWS Exam Prep. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Built for AWS Developers</span>
              <span className="text-red-500">•</span>
              <span>DVA-C02 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
