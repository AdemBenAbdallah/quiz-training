"use client";

import { usePricingModal } from "@/components/pricing/PricingContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { getAvailableCertificates } from "@/lib/certificates";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { Certificate } from "@/types/certificate";
import { ArrowRight, Check, Crown, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const plans = [
  {
    name: "Individual",
    price: 9.99,
    bundleType: "individual" as const,
    icon: <Star className="w-5 h-5" />,
    description: "Perfect for single certification",
    features: [
      "1 full certification",
      "All levels",
      "Detailed explanations",
      "Unlimited chat explanations",
      "Progress tracking",
      "Lifetime access",
      "Money-back guarantee",
    ],
    cta: "Get Started",
    popular: false,
    color: "blue",
  },
  {
    name: "Professional",
    price: 24.99,
    bundleType: "professional" as const,
    icon: <Zap className="w-5 h-5" />,
    description: "Most popular choice",
    features: [
      "3 certifications of your choice",
      "All levels for each cert",
      "Detailed explanations",
      "Unlimited chat explanations",
      "Priority support",
      "Lifetime access",
      "Money-back guarantee",
    ],
    cta: "Go Professional",
    popular: false,
    color: "red",
  },
  {
    name: "Complete",
    price: 49.99,
    bundleType: "complete" as const,
    icon: <Crown className="w-5 h-5" />,
    description: "Master all AWS certifications",
    features: [
      "All 11 AWS certifications",
      "Complete question database",
      "Detailed explanations",
      "Unlimited chat explanations",
      "Priority support",
      "Lifetime access",
      "Money-back guarantee",
    ],
    cta: "Get Everything",
    popular: true,
    color: "purple",
  },
];

type Step = "plans" | "select-certificates" | "checkout";
type TPlan = "professional" | "individual" | "complete";

export default function PricingModal() {
  const { isOpen, preselectedCertificateId, closePricingModal } =
    usePricingModal();
  const { data: session } = authClient.useSession();

  const [step, setStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState<TPlan | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(
    [],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificates] = useState<Certificate[]>(() =>
    getAvailableCertificates(),
  );

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("plans");
      setSelectedPlan(null);
      setSelectedCertificates(
        preselectedCertificateId ? [preselectedCertificateId] : [],
      );
    }
  }, [isOpen, preselectedCertificateId]);

  const handleCertificateToggle = (certificateId: string) => {
    const maxCerts = selectedPlan === "professional" ? 3 : 1;

    setSelectedCertificates((prev) => {
      if (prev.includes(certificateId)) {
        return prev.filter((id) => id !== certificateId);
      } else if (prev.length < maxCerts) {
        return [...prev, certificateId];
      }
      return prev;
    });
  };

  const handleCheckout = async (selectedPlan: TPlan) => {
    if (!session?.user) {
      window.location.href = "/auth/signin";
      return;
    }

    if (!selectedPlan) return;

    if (selectedPlan === "professional" && selectedCertificates.length !== 3) {
      setStep("select-certificates");
      setSelectedPlan("professional");
      return;
    }

    if (selectedPlan === "individual" && selectedCertificates.length === 0) {
      setStep("select-certificates");
      setSelectedPlan("individual");
      return;
    }

    setIsProcessing(true);

    try {
      const billingInfo = await getBillingInfo();

      const slugMap = {
        individual: "individual-plan",
        professional: "professional-plan",
        complete: "complete-plan",
      };

      const slug = slugMap[selectedPlan as keyof typeof slugMap];
      if (!slug) {
        alert("Payment configuration error. Please contact support.");
        return;
      }

      const { data: checkout, error } = await authClient.dodopayments.checkout({
        slug,
        billing: billingInfo,
        customer: {
          email: session.user.email,
          name: session.user.name,
        },
        referenceId: session.user.id,
        metadata: {
          planType: selectedPlan,
          selectedCertificates: JSON.stringify(
            selectedPlan === "complete" ? [] : selectedCertificates,
          ),
          bundleType: selectedPlan,
          certificateCount:
            selectedPlan === "complete"
              ? "11"
              : selectedPlan === "professional"
                ? "3"
                : "1",
        },
      } as any);

      if (error) {
        alert("Payment failed. Please try again.");
        return;
      }

      if (checkout?.url) {
        window.location.href = checkout.url;
      }
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePricingModal()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "plans" && "Choose Your Plan"}
            {step === "select-certificates" &&
              `Select ${selectedPlan === "professional" ? "3" : "1"} Certification${selectedPlan === "professional" ? "s" : ""}`}
            {step === "checkout" && "Complete Your Purchase"}
          </DialogTitle>
        </DialogHeader>

        {/* Plans Step */}
        {step === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {plans.map((plan) => (
              <div
                key={plan.bundleType}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.02] max-h-96 flex flex-col justify-between ${
                  plan.popular
                    ? "border-red-500 bg-red-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
                onClick={() => handleCheckout(plan.bundleType)}
              >
                <div>
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs">
                      Best Value
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`p-2 rounded-full ${
                        plan.popular ? "bg-red-500" : "bg-gray-700"
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="font-semibold">{plan.name}</h3>
                  </div>

                  <div className="mb-3">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">one-time</span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">
                    {plan.description}
                  </p>

                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-300"
                      >
                        <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  size="sm"
                >
                  {plan.cta}
                  {plan.bundleType === "complete" && (
                    <ArrowRight className="w-3 h-3 ml-1" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Selection Step */}
        {step === "select-certificates" && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {certificates.map((cert) => {
                const isSelected = selectedCertificates.includes(cert.id);
                const maxCerts = selectedPlan === "professional" ? 3 : 1;
                const canSelect =
                  selectedCertificates.length < maxCerts || isSelected;

                return (
                  <button
                    key={cert.id}
                    onClick={() =>
                      canSelect && handleCertificateToggle(cert.id)
                    }
                    disabled={!canSelect}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-red-500 bg-red-500/10"
                        : canSelect
                          ? "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                          : "border-gray-700 bg-gray-900/30 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {cert.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {cert.totalLevels} levels
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Selected: {selectedCertificates.length}/
                {selectedPlan === "professional" ? "3" : "1"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("plans")}
                  className="border-gray-600"
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCheckout(selectedPlan!)}
                  disabled={isProcessing}
                >
                  {selectedPlan === "individual"
                    ? "Continue to Payment"
                    : `Continue to Payment (${selectedCertificates.length}/3)`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
