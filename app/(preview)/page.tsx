"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AvatarMenu from "@/components/Avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useState } from "react";
import Image from "next/image";
import SignUp from "@/components/Signup";
import PublicQuiz from "@/components/PublicQuiz";
import Container from "@/components/ui/container";
import StarIcon from "@/components/icons/Star";
import { faqData, stepsData } from "./data";
import Footer from "@/components/footer";

export default function HomePage() {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 space-y-12">
          <div className="space-y-8 text-center">
            <div className="flex flex-col gap-6 items-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-balance !leading-[1.2]">
                Master 500+ DVA-C02 Questions.{" "}
                <span className="bg-red-700 text-white">
                  Pass With Confidence.
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed text-pretty max-w-6xl">
                Don&apos;t just memorize dumps. Our gamified quiz app provides
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

        {/*How it works */}
        <section className="bg-base-300" id="how">
          <div className="mx-auto max-w-7xl py-24 max-xl:px-4">
            <div className="mb-12 flex w-full flex-col text-center md:mb-20">
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-red-500">
                How it works?
              </p>
              <h2 className="mx-auto text-3xl font-extrabold tracking-tight md:text-5xl">
                Find revenue opportunities in 3 steps
              </h2>
            </div>

            <div className="flex flex-col justify-center gap-6 max-lg:items-center lg:flex-row">
              {stepsData.map((step, index) => (
                <Fragment key={index}>
                  <div className="rounded-[1.3rem] border border-base-content/5 bg-neutral/5 p-1.5 dark:bg-neutral/50">
                    <div className="custom-card card mx-auto w-full h-full max-w-lg">
                      <figure className="relative h-48">
                        <Image
                          src={step.imgSrc}
                          alt={step.imgAlt}
                          className="absolute inset-0 h-full w-full object-cover"
                          width={400}
                          height={192}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral/20 p-8 dark:bg-base-100/30 lg:items-start lg:justify-start"></div>
                      </figure>
                      <div className="flex flex-1 flex-col p-8 gap-2">
                        <h3 className="flex items-center gap-2 text-xl leading-7 font-semibold">
                          {step.id}. {step.title}
                        </h3>
                        <p className="text-base-secondary leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {index < stepsData.length - 1 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="text-base-secondary mx-auto w-6 shrink-0 opacity-90 max-lg:rotate-90"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Fragment>
              ))}
            </div>

            {/* Form Section */}
            <div className="mt-12">
              <div className="mx-auto flex w-64 flex-col items-center justify-center gap-1.5">
                <div className="w-full space-y-1">
                  <Button
                    onClick={() => setOpenSignUp(true)}
                    className="w-full"
                  >
                    <span>Start now</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                  <div className="text-gray-300 text-center text-sm opacity-80">
                    Unlock Level 1 for free. No card required.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Review */}
        <section className="mx-auto grid max-w-7xl grid-cols-1">
          <section className="mx-auto my-12 max-w-md space-y-4 max-lg:px-4 md:my-24 md:space-y-6 lg:max-w-lg">
            <div className="rating !flex justify-center">
              <StarIcon className="h-6 w-6 text-yellow-500" />
              <StarIcon className="h-6 w-6 text-yellow-500" />
              <StarIcon className="h-6 w-6 text-yellow-500" />
              <StarIcon className="h-6 w-6 text-yellow-500" />
              <StarIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="space-y-2 text-center text-base leading-relaxed lg:text-lg">
              <span className="bg-yellow-100/80 px-1.5 font-medium text-yellow-950 dark:bg-yellow-900/80 dark:text-yellow-100">
                AwsQuizGame is the best way to learn and prepare for the AWS
                Developer exam.
              </span>
              It was the main reason I was able to pass the exam faster and with
              confidence.
            </div>

            <div className="flex items-center justify-center gap-3 lg:gap-4">
              <Image
                alt="Wozu testimonial for DataFast"
                loading="lazy"
                width="48"
                height="48"
                className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12"
                src="/adem.webp"
              />
              <div>
                <p className="font-semibold lg:text-lg">Adem</p>
                <a
                  href="https://adembenabdallah.com"
                  className="text-base-secondary text-sm lg:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  adembenabdallah.com
                </a>
              </div>
            </div>
          </section>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl lg:text-3xl text-center font-bold text-white">
              FAQ
            </h2>

            <div className="space-y-4">
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

        <Footer onSignUpClickAction={() => setOpenSignUp(true)} />

        {openSignUp && (
          <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black  flex items-center justify-center">
            <SignUp />
          </div>
        )}
      </div>
    </div>
  );
}
