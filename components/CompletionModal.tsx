"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { useState } from "react";

interface CompletionModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  level: number;
}

export default function CompletionModal({
  isOpen,
  onCloseAction,
  level,
}: CompletionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = authClient.useSession();

  const handleUpgrade = async () => {
    if (!session?.user) {
      console.error("No user session found");
      return;
    }

    setIsProcessing(true);

    try {
      const billingInfo = await getBillingInfo();
      const { data: checkout, error } = await authClient.dodopayments.checkout({
        slug: "individual-plan",
        billing: {
          city: billingInfo.city,
          country: billingInfo.country,
          state: billingInfo.state,
          street: billingInfo.street,
          zipcode: billingInfo.zipcode,
        },
        customer: {
          email: session.user.email,
          name: session.user.name,
        },
        referenceId: session.user.id,
      });

      if (error) {
        console.error("Checkout error:", error);
        return;
      }

      if (checkout?.url) {
        window.location.href = checkout.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md border-2 border-gray-200 rounded-2xl p-8">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Great job!
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-700">
            You&aspos;ve completed Level {level}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Description text */}
          <p className="text-center text-gray-600 text-sm leading-relaxed">
            Unlock full access to this
            <br />
            certification with detailed
            <br />
            explanations and final
            <br />
            challenge questions
          </p>

          {/* Price and badge section */}
          <div className="flex items-center justify-center gap-6">
            <div className="text-4xl font-bold text-gray-800">$9.99</div>
            <div className="relative">
              <Badge
                variant="secondary"
                className="bg-gray-400 text-white px-4 py-2 text-sm font-semibold rounded-full"
              >
                PASS
              </Badge>
              {/* Ribbon decoration */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-400"></div>
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Upgrade button */}
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Unlock Full Access - $9.99"}
          </Button>

          {/* Social proof */}
          <p className="text-center text-gray-500 text-xs">
            Or choose Professional ($24.99) for
            <br />
            3 certifications or Complete ($49.99)
            <br />
            for all AWS certifications
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
