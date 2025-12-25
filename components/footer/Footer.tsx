"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import { useClientProvider } from "../landing/client-provider";
import { Logo } from "../landing/navigation";

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
            <Logo />
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Prepare for your certification with our practice platform.
              Detailed explanations, progress tracking, and AI-powered
              assistance.
            </p>
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-5 h-5 text-red-500" suppressHydrationWarning />
              <a
                href="mailto:adembenabdallah.contact@gmail.com"
                className="hover:text-white transition-colors duration-200"
              >
                support@certquickly.com.
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection("features")}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how")}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                How it Works
              </button>
              <Link
                href="/certificates"
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Certificates
              </Link>
              <button
                onClick={() => scrollToSection("faq")}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">
              Ready to Start?
            </h3>
            <p className="text-gray-400 text-sm">
              Join thousands of learners preparing for their certification.
            </p>
            <Button
              onClick={handleStart}
              className="w-full bg-white text-black font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Get Started
              <ExternalLink className="w-4 h-4 ml-2" suppressHydrationWarning />
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} CertQuickly. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>11 Certificates Available</span>
              <span className="text-red-500">•</span>
              <span>1,200+ Questions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
