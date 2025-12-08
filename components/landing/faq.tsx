"use client";

import { faqData } from "@/components/landing/data";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Suspense, useState } from "react";

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="container mx-auto px-4 py-24">
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
              <Suspense fallback={<div>Loading...</div>}>
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
              </Suspense>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
