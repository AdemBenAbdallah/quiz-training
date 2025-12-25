"use client";

import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/ui/section-header";
import Image from "next/image";
import { Fragment } from "react";
import { useClientProvider } from "./client-provider";
import { stepsData } from "./data";

export default function HowItWorks() {
  const { handleStart } = useClientProvider();
  return (
    <section className="bg-base-300" id="how">
      <div className="mx-auto max-w-7xl py-24 max-xl:px-4">
        <SectionHeader
          subtitle="How it works?"
          title="Pass your AWS certification in 3 steps"
        />

        <div className="flex flex-col justify-center gap-6 max-lg:items-center lg:flex-row">
          {stepsData.map((step, index) => (
            <Fragment key={index}>
              <div className="rounded-[1.3rem] border border-base-content/5 bg-neutral/5 p-1.5 dark:bg-neutral/50 flex items-stretch">
                <div className="custom-card card mx-auto w-full h-[400px] flex flex-col max-w-lg">
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
                  <div className="flex flex-1 flex-col p-8 gap-2 justify-between">
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
                onClick={handleStart}
                variant="outline"
                className="w-full bg-white text-black"
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
  );
}
