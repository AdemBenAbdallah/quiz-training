"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Frown, Lock } from "lucide-react";
import useLocalStorage from "@/hook/useLocalStorage";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/variants";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { useProgress } from "@/hooks/useProgress";

export default function LevelsPage() {
  const { data: progressData, isLoading: progressLoading } = useProgress();
  const router = useRouter();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const handleCheckout = async (levelId: number) => {
    if (levelId === 1) {
      router.push("/level/1");
      return;
    }

    const billingInfo = await getBillingInfo();
    const { data: checkout, error } = await authClient.dodopayments.checkout({
      slug: "premium-plan",
      billing: {
        city: billingInfo.city,
        country: billingInfo.country,
        state: billingInfo.state,
        street: billingInfo.street,
        zipcode: billingInfo.zipcode,
      },
      customer: {
        email: session?.user.email,
        name: session?.user.name,
      },
      referenceId: session?.user.id,
    });
  };

  if (!progressData?.levelParts || progressLoading) {
    return null;
  }

  const levelParts = progressData.levelParts;

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
      <motion.h1
        className={`text-4xl sm:text-5xl font-bold text-white mb-16 z-10`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Quiz <span className="text-red-500">AWS</span> DVA-C02
      </motion.h1>

      <motion.div
        className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 sm:gap-10 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {levelParts.map((level) => (
          <motion.div key={level.id} variants={itemVariants}>
            {level.passed ? (
              <button
                onClick={() => handleCheckout(level.id)}
                className="group relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-2xl transition-transform duration-300 ease-in-out hover:scale-105"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-red-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
                <div className="relative w-full h-full flex items-center justify-center bg-neutral-900/70 border border-white/20 rounded-2xl backdrop-blur-lg">
                  <span className="text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                    {level.id}
                  </span>
                </div>
              </button>
            ) : (
              <div className="relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-2xl">
                <div className="relative flex items-center justify-center w-full h-full rounded-2xl  border border-neutral-700 bg-neutral-900/50 backdrop-blur-md text-neutral-600 cursor-not-allowed overflow-hidden blur-sm">
                  <span className="text-4xl font-bold text-neutral-700">
                    {level.id}
                  </span>
                </div>
                <Lock className="absolute w-10 h-10 text-neutral-500 z-30" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
