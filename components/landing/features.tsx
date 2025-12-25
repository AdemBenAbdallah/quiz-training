"use client";

import SectionHeader from "@/components/ui/section-header";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    imgSrc: "/features/ai-explain.png",
    imgAlt: "AI explanation feature",
    title: "Understand every answer",
    description:
      "Don't just memorize—learn why each answer is right or wrong with detailed AI-powered explanations that connect the dots.",
  },
  {
    imgSrc: "/features/progress.png",
    imgAlt: "Progress tracking",
    title: "Track your improvement",
    description:
      "Watch your score climb as you practice. See exactly which topics need more work and celebrate your wins along the way.",
  },
  {
    imgSrc: "/features/chat.png",
    imgAlt: "Chat assistant",
    title: "Ask anything",
    description:
      "Stuck on a concept? Chat with our AI assistant for instant clarification. It's like having a tutor available 24/7.",
  },
];

export default function Features() {
  return (
    <section className="bg-base-300" id="features">
      <div className="mx-auto max-w-7xl py-24 max-xl:px-4">
        <SectionHeader
          subtitle="Why CertQuickly?"
          title="Everything you need to get certified"
        />

        <div className="flex flex-col justify-center gap-6 max-lg:items-center lg:flex-row">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="rounded-[1.3rem] border border-base-content/5 bg-neutral/5 p-1.5 dark:bg-neutral/50 flex items-stretch">
                <div className="custom-card card mx-auto w-full h-[380px] flex flex-col max-w-lg">
                  <figure className="relative h-48">
                    <Image
                      src={feature.imgSrc}
                      alt={feature.imgAlt}
                      className="absolute inset-0 h-full w-full object-cover"
                      width={400}
                      height={192}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral/20 p-8 dark:bg-base-100/30 lg:items-start lg:justify-start"></div>
                  </figure>
                  <div className="flex flex-1 flex-col p-8 gap-2 justify-between">
                    <h3 className="flex items-center gap-2 text-xl leading-7 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-base-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
