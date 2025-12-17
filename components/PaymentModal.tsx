"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  createCheckoutData,
  validateDodoPaymentsConfig,
} from "@/lib/dodopayments-config";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { Check, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function PaymentModal({
  isOpen,
  onCloseAction,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Lock scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleUpgrade = async () => {
    if (!session?.user) {
      console.error("No user session found");
      return;
    }

    // Validate configuration
    const configValidation = validateDodoPaymentsConfig();
    if (!configValidation.valid) {
      console.error(
        "DodoPayments configuration errors:",
        configValidation.errors,
      );
      alert("Payment system configuration error. Please contact support.");
      return;
    }

    setIsProcessing(true);
    try {
      const billingInfo = await getBillingInfo();

      // Create checkout data using the new config utility
      const checkoutData = createCheckoutData(
        "individual",
        billingInfo,
        {
          email: session.user.email,
          name: session.user.name,
        },
        session.user.id,
      );

      const { data: checkout, error } =
        await authClient.dodopayments.checkout(checkoutData);

      if (error) {
        console.error("Checkout error:", error);
        alert("Payment failed. Please try again.");
        return;
      }

      if (checkout?.url) {
        window.location.href = checkout.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCloseAction}
    >
      <div
        className="relative w-full max-w-[420px] bg-black"
        onClick={(e) => e.stopPropagation()} // prevent close on inner click
      >
        <div className="relative z-10 rounded-[32px] overflow-hidden ring-1 ring-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          {/* Background gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 animate-gradient-move bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,170,100,0.6),rgba(0,0,0,0.3)_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          </div>

          <style jsx>{`
            @keyframes gradient-move {
              0% {
                transform: translate(0, 0) scale(1);
                opacity: 0.6;
              }
              25% {
                transform: translate(10px, -10px) scale(1.05);
                opacity: 0.7;
              }
              50% {
                transform: translate(5px, 5px) scale(1.02);
                opacity: 0.8;
              }
              75% {
                transform: translate(-10px, 5px) scale(1.05);
                opacity: 0.7;
              }
              100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.6;
              }
            }
            .animate-gradient-move {
              animation: gradient-move 8s ease-in-out infinite;
            }
          `}</style>

          <div className="relative p-8">
            <div className="text-white text-lg font-medium mb-6">Premium</div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-white text-[64px] font-bold leading-none tracking-tighter">
                  $4
                </span>
                <span className="text-white/60 text-2xl font-light leading-none">
                  .99
                </span>
              </div>
              <p className="text-white/70 text-sm mt-3">
                One-time payment • Lifetime access
              </p>
            </div>

            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Ace your exam—complete all levels, 100% guaranteed!
            </p>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

            <div className="space-y-4 mb-8">
              {[
                "Access to all 8 quiz levels",
                "Access all quizzes with detailed explanation",
                "Unlimited quiz attempts",
                "Priority support",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0 stroke-[2.5]" />
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-light">
                      {item}
                    </span>
                    {(i === 2 || i === 3) && (
                      <Info className="h-3.5 w-3.5 text-white/40" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="relative w-full bg-white z-10 hover:bg-white/95 text-black font-semibold py-6 rounded-2xl transition-all duration-200 text-base shadow-lg hover:shadow-xl"
          >
            {isProcessing ? "Processing..." : "Start"}
          </Button>
        </div>

        {/* Close button (optional) */}
        <button
          onClick={onCloseAction}
          className="absolute z-10 top-3 right-3 text-white/60 hover:text-white transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
