"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionHeader from "@/components/ui/section-header";
import { authClient } from "@/lib/auth-client";
import { getAvailableCertificates } from "@/lib/certificates";
import { getBillingInfo } from "@/lib/utils/get-user-location";
import { BUNDLE_CONFIGS } from "@/lib/utils/payment";
import { Certificate } from "@/types/certificate";
import { ArrowRight, Check, Crown, Star, Zap } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Individual",
    price: 9.99,
    bundleType: "individual" as const,
    icon: <Star className="w-6 h-6" />,
    description: "Perfect for single certification",
    features: [
      "1 full certification",
      "All levels (1-8)",
      "Final challenging questions",
      "Detailed explanations for every question",
      "Detailed explanations for every choice",
      "Progress tracking",
      "Lifetime access",
      "Money-back guarantee",
    ],
    cta: "Start Learning",
    popular: false,
    color: "blue",
  },
  {
    name: "Professional",
    price: 24.99,
    bundleType: "professional" as const,
    icon: <Zap className="w-6 h-6" />,
    description: "Most popular choice",
    features: [
      "3 certifications of your choice",
      "All levels for each certification",
      "Final challenging questions for all certs",
      "Detailed explanations for every question & choice",
      "Progress tracking across certifications",
      "Priority support",
      "Lifetime access",
      "Money-back guarantee",
    ],
    cta: "Go Professional",
    popular: true,
    color: "red",
  },
  {
    name: "Complete",
    price: 49.99,
    bundleType: "complete" as const,
    icon: <Crown className="w-6 h-6" />,
    description: "Master all AWS certifications",
    features: [
      "All 11 AWS certifications",
      "Complete question database",
      "Final challenging questions for all certs",
      "Detailed explanations for every question & choice",
      "Progress tracking across all certifications",
      "Priority support",
      "Advanced analytics",
      "Lifetime access",
      "Money-back guarantee",
    ],
    cta: "Get Everything",
    popular: false,
    color: "purple",
  },
];

export default function Pricing() {
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(
    [],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [certificates] = useState<Certificate[]>(() =>
    getAvailableCertificates(),
  );

  const { data: session } = authClient.useSession();

  const handlePlanSelect = (planType: string) => {
    if (planType === "professional") {
      setSelectedCertificates([]);
      setShowCheckoutForm(false);
      setShowCertificateModal(true);
    } else {
      handleCheckout(planType);
    }
  };

  const handleModalClose = () => {
    setShowCertificateModal(false);
    setShowCheckoutForm(false);
    setSelectedCertificates([]);
  };

  const handleModalComplete = () => {
    setShowCheckoutForm(true);
  };

  const handleCertificateToggle = (certificateId: string) => {
    setSelectedCertificates((prev) => {
      const config = BUNDLE_CONFIGS.professional;
      if (prev.includes(certificateId)) {
        return prev.filter((id) => id !== certificateId);
      } else if (prev.length < config.certificateCount) {
        return [...prev, certificateId];
      }
      return prev;
    });
  };

  const handleCheckout = async (planType: string) => {
    if (!session?.user) {
      window.location.href = "/auth/signin";
      return;
    }

    setIsProcessing(true);

    try {
      let checkoutData: any = {};

      if (planType === "professional") {
        if (selectedCertificates.length !== 3) {
          alert(
            "Please select exactly 3 certifications for the Professional plan",
          );
          setIsProcessing(false);
          return;
        }
        checkoutData.selectedCertificates = selectedCertificates;
      }

      const billingInfo = await getBillingInfo();

      // Map plan types to slugs configured in auth.ts
      const slugMap = {
        individual: "individual-plan",
        professional: "professional-plan",
        complete: "complete-plan",
      };

      const slug = slugMap[planType as keyof typeof slugMap];
      if (!slug) {
        console.error(`Slug not found for plan type: ${planType}`);
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
          planType,
          selectedCertificates:
            planType === "professional"
              ? JSON.stringify(selectedCertificates)
              : JSON.stringify([]),
          bundleType: planType,
          certificateCount:
            BUNDLE_CONFIGS[
              planType as keyof typeof BUNDLE_CONFIGS
            ]?.certificateCount.toString() || "1",
          ...checkoutData,
        },
      } as any);

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

  const getColorClasses = (color: string, popular: boolean = false) => {
    const colors = {
      blue: popular
        ? "border-blue-500 bg-gradient-to-b from-blue-500/10 to-transparent shadow-lg shadow-blue-500/20"
        : "border-gray-700 bg-gray-900/50",
      red: popular
        ? "border-red-500 bg-gradient-to-b from-red-500/10 to-transparent shadow-lg shadow-red-500/20"
        : "border-gray-700 bg-gray-900/50",
      purple: popular
        ? "border-purple-500 bg-gradient-to-b from-purple-500/10 to-transparent shadow-lg shadow-purple-500/20"
        : "border-gray-700 bg-gray-900/50",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string, popular: boolean = false) => {
    const colors = {
      blue: popular ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400",
      red: popular ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400",
      purple: popular
        ? "bg-purple-500 text-white"
        : "bg-gray-800 text-gray-400",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getButtonClasses = (popular: boolean = false) => {
    return popular
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600";
  };

  return (
    <section id="pricing" className="container mx-auto px-4 py-24">
      <SectionHeader subtitle="AWS Training" title="Find Your Perfect Plan" />

      {/* Professional Plan Certificate Selection and Checkout Modal */}
      {showCertificateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-xl border border-gray-700 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  {!showCheckoutForm
                    ? "Select 3 Certifications for Professional Plan"
                    : "Complete Your Purchase"}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {!showCheckoutForm ? (
                // Certificate Selection Step
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {certificates.map((cert) => {
                      const isSelected = selectedCertificates.includes(cert.id);
                      const canSelect =
                        selectedCertificates.length < 3 || isSelected;

                      return (
                        <button
                          key={cert.id}
                          onClick={() =>
                            canSelect && handleCertificateToggle(cert.id)
                          }
                          disabled={!canSelect}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "border-red-500 bg-red-500/10 text-white"
                              : canSelect
                                ? "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                                : "border-gray-700 bg-gray-900/30 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">
                                {cert.name}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">
                                {cert.totalLevels} levels
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Selected: {selectedCertificates.length}/3 certifications
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleModalClose}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleModalComplete}
                        disabled={selectedCertificates.length !== 3}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                // Checkout Step
                <>
                  <div className="mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-2">
                        Selected Certifications:
                      </h4>
                      <div className="space-y-2">
                        {selectedCertificates.map((certId) => {
                          const cert = certificates.find(
                            (c) => c.id === certId,
                          );
                          return (
                            <div
                              key={certId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-300">
                                {cert?.name || certId}
                              </span>
                              <Check className="w-4 h-4 text-green-500" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">
                          Professional Plan
                        </span>
                        <span className="text-2xl font-bold text-white">
                          $24.99
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        one-time payment
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowCheckoutForm(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Back to Selection
                    </Button>
                    <Button
                      onClick={() => handleCheckout("professional")}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Proceed to Payment - $24.99"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${getColorClasses(plan.color, plan.popular)} hover:scale-105 transition-all duration-200`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-red-500 text-white px-4 py-1 text-uppercase">
                  Best to start
                </Badge>
              </div>
            )}

            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full ${getIconColorClasses(plan.color, plan.popular)}`}
                >
                  {plan.icon}
                </div>
              </div>

              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  {plan.description}
                </CardDescription>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">one-time</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handlePlanSelect(plan.bundleType)}
                className={`w-full ${getButtonClasses(plan.popular)}`}
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : plan.cta}
                {plan.bundleType === "professional" && (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
