"use client";

import { Lock, Crown } from "lucide-react";
import NextLink from "next/link";
import PaymentModal from "./PaymentModal";
import { useState } from "react";

type TItem = {
  passed: boolean;
  accessible: boolean;
  needsPayment?: boolean;
  start: number;
  end: number;
};

interface QuizCardProps {
  idx: number;
  levelId: number;
  item: TItem;
  isLast: boolean;
}

export default function QuizCard({
  idx,
  levelId,
  item,
  isLast,
}: QuizCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isLocked = !item.accessible;
  const needsPayment = item.needsPayment || false;

  const handleClick = (e: React.MouseEvent) => {
    if (needsPayment) {
      e.preventDefault();
      setShowPaymentModal(true);
    }
  };

  const cardContent = (
    <div className="relative z-10">
      <div className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
        {isLast ? "Final Part of the Quiz" : `Quiz Part ${idx + 1}`}
      </div>
      <div className="text-muted-foreground text-base mb-6 tracking-wide">
        Questions {item.start + 1} - {item.end + 1}
      </div>
      <div className="flex justify-center">
        <span
          className={`px-6 py-2 rounded-full font-semibold shadow transition-all duration-300
            ${
              !isLocked
                ? "bg-primary text-black hover:bg-primary/90 hover:shadow-lg"
                : "bg-muted text-muted-foreground"
            }`}
        >
          {needsPayment ? "Upgrade" : isLocked ? "Locked" : "Start"}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />

        {needsPayment ? (
          <div
            onClick={handleClick}
            className="block border relative rounded-2xl bg-gradient-to-br from-background to-muted/40 shadow-md p-8 text-center transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-xl"
            style={{ minHeight: 200 }}
          >
            {cardContent}
          </div>
        ) : (
          <NextLink
            href={!isLocked ? `/quiz/${idx + 1}/${levelId}` : "#"}
            className={`block border relative rounded-2xl bg-gradient-to-br from-background to-muted/40 shadow-md p-8 text-center transition-all duration-300 overflow-hidden
              ${
                !isLocked
                  ? "hover:scale-[1.02] hover:shadow-xl"
                  : "cursor-not-allowed pointer-events-none opacity-70 locked-card"
              }`}
            style={{ minHeight: 200 }}
          >
            {cardContent}
          </NextLink>
        )}

        {isLocked && !needsPayment && (
          <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
            <Lock className="text-white w-10 h-10 opacity-90" />
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onCloseAction={() => setShowPaymentModal(false)}
      />
    </>
  );
}
