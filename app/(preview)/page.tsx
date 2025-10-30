"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AvatarMenu from "@/components/Avatar";
import { Check, ChevronDown, ChevronUp, Quote } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
                <span className="bg-red-700 text-white">The Fun Way</span>
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
                Start Playing
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

        {/* Practice Timeline – Alternating */}
        <section className="container mx-auto px-4 py-16 lg:py-24 relative">
          {/* Section header */}
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Let’s Make Practice Simple — Step by Step
            </h2>
          </div>

          {/* Timeline wrapper */}
          <div className="relative mt-12 max-w-5xl mx-auto">
            {/* Curved SVG line */}
            {/* Mobile curved dashed line */}
            <svg
              className="lg:hidden absolute inset-0 pointer-events-none z-0"
              viewBox="0 0 800 1800"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="timelineGradientMobile"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Mobile path */}
              <path
                d="M400 0 C 440 120 360 240 400 360 S 440 600 400 720 S 360 960 400 1080 S 440 1320 400 1440 S 360 1560 400 1800"
                fill="none"
                stroke="url(#timelineGradientMobile)"
                strokeWidth="4"
                strokeLinecap="round"
                className="dash-anim vector-stroke opacity-80"
              />
            </svg>

            {/* Desktop curved dashed line */}
            <svg
              className="hidden lg:block absolute inset-0 pointer-events-none z-10"
              viewBox="0 0 1000 1500"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="timelineGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Main path */}
              <path
                d="M500 0 C 540 120 460 240 500 360 S 540 600 500 720 S 460 960 500 1080 S 540 1320 500 1440 S 460 1560 500 1800"
                fill="none"
                stroke="url(#timelineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                className="dash-anim vector-stroke opacity-80"
              />
            </svg>

            {/* STEP 1 - ABOVE the line */}
            <div className="relative lg:grid lg:grid-cols-2 items-start py-10">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:pl-12 relative z-10 lg:z-0"
              >
                <div className="group relative z-10 lg:z-0 rounded-2xl bg-neutral-900/80 backdrop-blur-sm ring-1 ring-white/10 p-6 shadow-xl overflow-visible">
                  <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-700" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-7 px-3 items-center rounded-full text-xs font-semibold bg-white text-black">
                      Step 1
                    </span>
                    <span className="text-gray-400 text-sm">
                      Take the task or quiz
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-emerald-400 mt-1" />
                    <p className="text-gray-300 leading-relaxed">
                      Read the questions carefully and try to understand them
                      before answering.
                    </p>
                  </div>
                </div>
              </motion.div>
              <div aria-hidden className="hidden lg:block" />
            </div>

            {/* STEP 2 - UNDER the line */}
            <div className="relative lg:grid lg:grid-cols-2 items-start py-10">
              <div aria-hidden className="hidden lg:block" />
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:pl-12 relative z-10 lg:z-0"
              >
                <div className="group relative z-10 lg:z-0 rounded-2xl bg-neutral-900/80 backdrop-blur-sm ring-1 ring-white/10 p-6 shadow-xl overflow-visible">
                  <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-700" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-7 px-3 items-center rounded-full text-xs font-semibold bg-white text-black">
                      Step 2
                    </span>
                    <span className="text-gray-400 text-sm">
                      Attempt your first try
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-sky-400 mt-1" />
                    <p className="text-gray-300 leading-relaxed">
                      Do your best to answer all questions. If you get some
                      wrong, that’s okay — this step helps you identify what you
                      don’t know.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* STEP 3 - ABOVE the line again */}
            <div className="relative lg:grid lg:grid-cols-2 items-start py-10">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:pl-12 relative z-10 lg:z-0"
              >
                <div className="group relative z-10 lg:z-0 rounded-2xl bg-neutral-900/80 backdrop-blur-sm ring-1 ring-white/10 p-6 shadow-xl overflow-visible">
                  <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-700" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-7 px-3 items-center rounded-full text-xs font-semibold bg-white text-black">
                      Step 3
                    </span>
                    <span className="text-gray-400 text-sm">
                      Reflect on your mistakes
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-violet-400 mt-1" />
                    <p className="text-gray-300 leading-relaxed">
                      Think about the questions you got wrong and try to
                      understand why.
                    </p>
                  </div>
                </div>
              </motion.div>
              <div aria-hidden className="hidden lg:block" />
            </div>
            {/* STEP 4 - UNDER the line */}
            <div className="relative lg:grid lg:grid-cols-2 items-start py-10">
              <div aria-hidden className="hidden lg:block" />
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:pl-12 relative z-10 lg:z-0"
              >
                <div className="group relative z-10 lg:z-0 rounded-2xl bg-neutral-900/80 backdrop-blur-sm ring-1 ring-white/10 p-6 shadow-xl overflow-visible">
                  <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-700" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-7 px-3 items-center rounded-full text-xs font-semibold bg-white text-black">
                      Step 4
                    </span>
                    <span className="text-gray-400 text-sm">
                      Use the “Get Answer” feature
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-amber-400 mt-1" />
                    <p className="text-gray-300 leading-relaxed">
                      Check the correct answers and read the explanations in
                      detail. This helps your brain connect your answers with
                      the right ones.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* STEP 5 - ABOVE the line again */}
            <div className="relative lg:grid lg:grid-cols-2 items-start py-10">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:pl-12 relative z-10 lg:z-0"
              >
                <div className="group relative z-10 lg:z-0 rounded-2xl bg-neutral-900/80 backdrop-blur-sm ring-1 ring-white/10 p-6 shadow-xl overflow-visible">
                  <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-700" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-7 px-3 items-center rounded-full text-xs font-semibold bg-white text-black">
                      Step 5
                    </span>
                    <span className="text-gray-400 text-sm">
                      Try again without looking at the answers
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-rose-400 mt-1" />
                    <p className="text-gray-300 leading-relaxed">
                      Take the quiz a second or third time, relying only on what
                      you’ve learned.
                    </p>
                  </div>
                </div>
              </motion.div>
              <div aria-hidden className="hidden lg:block" />
            </div>

            {/* STEP 6 - UNDER the line */}
            <div className="relative lg:grid lg:grid-cols-2 items-start py-10">
              <div aria-hidden className="hidden lg:block" />
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:pl-12 relative z-10 lg:z-0"
              >
                <div className="group relative z-10 lg:z-0 rounded-2xl bg-neutral-900/80 backdrop-blur-sm ring-1 ring-white/10 p-6 shadow-xl overflow-visible">
                  <div className="absolute -inset-1 pointer-events-none bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-700" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-7 px-3 items-center rounded-full text-xs font-semibold bg-white text-black">
                      Step 6
                    </span>
                    <span className="text-gray-400 text-sm">
                      Evaluate and repeat if needed
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-teal-400 mt-1" />
                    <p className="text-gray-300 leading-relaxed">
                      If you pass — great! That means you’ve learned. If not,
                      repeat the steps until you succeed. Keep going and don’t
                      give up.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Animations & styling */}
          <style jsx>{`
            @keyframes dash-move {
              0% {
                stroke-dashoffset: 0;
              }
              100% {
                stroke-dashoffset: -400;
              }
            }
            :global(.dash-anim) {
              stroke-dasharray: 12 14;
              animation: dash-move 4s linear infinite;
              filter: drop-shadow(0 0 6px rgba(14, 165, 233, 0.3));
            }
            :global(.vector-stroke) {
              vector-effect: non-scaling-stroke;
            }
          `}</style>
        </section>

        {/*This Text to me to users */}
        <section className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="relative mx-auto max-w-5xl">
            {/* Soft animated blobs */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="animate-floaty absolute -top-10 -left-10 h-56 w-56 rounded-full bg-gradient-to-tr from-rose-500/25 via-sky-400/20 to-violet-500/25 blur-3xl motion-reduce:animate-none" />
              <div className="animate-floaty-delayed absolute -bottom-12 -right-8 h-64 w-64 rounded-full bg-gradient-to-tr from-yellow-400/20 via-rose-500/20 to-sky-400/20 blur-3xl motion-reduce:animate-none" />
            </div>

            <div className="group relative rounded-3xl p-[2px] overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-3xl opacity-60 animate-spin-slower bg-[conic-gradient(at_30%_50%,#22d3ee_0deg,#f43f5e_120deg,#a78bfa_240deg,#22d3ee_360deg)] motion-reduce:animate-none" />

              <div className="relative rounded-3xl bg-neutral-950/70 ring-1 ring-white/10 border border-neutral-800 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 backdrop-blur">
                <div className="relative flex-shrink-0">
                  <Image
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover ring-2 ring-white/10 shadow-lg"
                    alt="adembenabdallah"
                    src={"/adem.webp"}
                    width={128}
                    height={128}
                  />
                </div>

                <div className="flex-1 space-y-3 sm:space-y-4">
                  <p className="relative text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-200">
                    <span className="absolute -top-7 md:-top-2 -left-2 md:-left-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-white shadow-md">
                      <Quote className="w-8 sm:w-10" color="white" />
                    </span>
                    When I was preparing for the AWS Developer exam, I couldn’t
                    find a good quiz to practice with. Most of them were
                    outdated and didn’t include explanations or motivation to
                    keep practicing. That’s why I created this web quiz game —
                    it helped me pass, and I want to help others too.
                    <span className="absolute -bottom-2 -right-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-white shadow-md">
                      <Quote className="w-8 sm:w-10" color="white" />
                    </span>
                  </p>

                  <div className="flex items-center justify-end">
                    <p className="text-xs sm:text-sm md:text-base tracking-wide text-gray-400">
                      Best of luck, my friend!
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
