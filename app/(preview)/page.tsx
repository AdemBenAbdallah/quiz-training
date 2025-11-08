"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AvatarMenu from "@/components/Avatar";
import { Check, ChevronDown, ChevronUp, Quote } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import SignUp from "@/components/Signup";
import PublicQuiz from "@/components/PublicQuiz";
import Container from "@/components/ui/container";

export default function HomePage() {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
              <div className="flex gap-2 items-center">
                <Image
                  src="/logo.png"
                  alt="AWS Quiz Logo"
                  width={34}
                  height={34}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">AWS Exam</span>
              </div>
              <AvatarMenu setOpen={setOpenSignUp} />
            </div>
          </div>
        </nav>
        {openSignUp && (
          <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black  flex items-center justify-center">
            <SignUp />
          </div>
        )}

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16  space-y-12">
          <div className="space-y-8 text-center">
            <div className="flex flex-col gap-6 items-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-balance !leading-[1.2]  ">
                Master 500+ DVA-C02 Questions.{" "}
                <span className="bg-red-700 text-white">
                  Pass With Confidence.
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed text-pretty max-w-6xl">
                Don't just memorize dumps. Our gamified quiz app provides
                detailed explanations for every answer, so you *actually* learn
                the concepts. Try it free.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setOpenSignUp(true)}
                size="lg"
                className="bg-white text-black font-semibold px-8 py-4 text-xl rounded-xl transition-all duration-200 hover:scale-105"
              >
                Start For Free
              </Button>
            </div>
          </div>

          <Container>
            <PublicQuiz setOpenSignUp={setOpenSignUp} />
          </Container>
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
                <motion.div
                  key={index}
                  className="border border-gray-800 rounded-xl bg-neutral-900/50 backdrop-blur-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/50 transition-all duration-300 rounded-xl"
                  >
                    <span className="text-lg font-medium text-white">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: { duration: 0.4, ease: "easeInOut" },
                            opacity: { duration: 0.3, delay: 0.1 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="px-6 pb-4"
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <p className="text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="p-8 text-center">
          <p className="text-gray-400">
            For Any Questions, Please Contact Us At:
          </p>
          <p className="text-gray-500">adembenabdallah.contact@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
