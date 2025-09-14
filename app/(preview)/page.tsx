"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AvatarMenu from "@/components/Avatar";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "What happens if I don't pass the AWS exam?",
      answer:
        "We offer a 100% money-back guarantee. If you complete all levels and don't pass the AWS Developer Associate exam, we'll refund your full payment.",
    },
    {
      question: "How long do I have access to the content?",
      answer:
        "Your access is lifetime! Once you purchase, you can access all current and future content updates forever.",
    },
    {
      question: "What AWS exam does this prepare me for?",
      answer:
        "This course is specifically designed for the AWS Certified Developer Associate (DVA-C02) exam.",
    },
    {
      question: "How is this different from other AWS courses?",
      answer:
        "Our gamified approach makes learning engaging and memorable. You progress through levels, earn achievements, and get hands-on experience with real AWS scenarios.",
    },
    {
      question: "Do I need prior AWS experience?",
      answer:
        "No prior AWS experience is required. Our course starts from the basics and gradually builds up to advanced concepts.",
    },
  ];
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

              <AvatarMenu />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 space-y-12">
          <div className="space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-balance !leading-[1.2]  ">
                Pass the AWS Developer Associate Exam —
                <span className="bg-red-700 text-white">
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
                onClick={() => router.push("/signup")}
                size="lg"
                className="bg-white text-black font-semibold px-8 py-4 text-xl rounded-xl transition-all duration-200 hover:scale-105"
              >
                Start Learning - $30
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center w-full h-auto rounded-2xl overflow-hidden bg-gray-800">
            <video
              src="demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-400">
                One payment. Lifetime access. Money-back guarantee.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-neutral-900 border border-red-700/50 rounded-2xl p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center px-3 py-1 bg-red-700 text-white text-sm font-medium rounded-full">
                      LIFETIME ACCESS
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Premium Plan
                    </h3>
                    <div className="space-y-1">
                      <div className="text-5xl font-bold text-white">$30</div>
                      <div className="text-gray-400">One-time payment</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white">
                        Complete AWS DVA-C02 course
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white">
                        Gamified learning experience
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white">
                        Practice exams & quizzes
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white">
                        Mobile-friendly platform
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white">
                        100% money-back guarantee
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-white">
                        Lifetime updates & support
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => router.push("/signup")}
                    className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    Get Lifetime Access - $30
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      🛡️ Protected by our money-back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-16 lg:py-24">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-400">
                Everything you need to know about AWS Quiz
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-800 rounded-xl bg-neutral-900/50 backdrop-blur-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/50 transition-colors rounded-xl"
                  >
                    <span className="text-lg font-medium text-white">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Still have questions?
                </h3>
                <p className="text-gray-400">
                  We're here to help. Get in touch with us.
                </p>
              </div>
              <p className="text-gray-400">adembenabdallah.contact@gmail.com</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
