"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setVerificationStatus("error");
        setIsVerifying(false);
        return;
      }

      try {
        // Wait a moment for webhook to process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // You could add an API call here to verify payment status
        // For now, we'll assume success if status=succeeded
        if (status === "succeeded") {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("error");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setVerificationStatus("error");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentId, status]);

  const handleContinue = () => {
    router.push("/certificates");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Verifying your payment...
          </h2>
          <p className="text-gray-400">
            Please wait while we confirm your purchase.
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase! Your payment has been confirmed and
            your access has been activated.
          </p>
          <div className="space-y-3">
            <Button onClick={handleContinue} className="w-full">
              Start Learning
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="w-full border-gray-600 hover:bg-gray-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4">
          Payment Verification Pending
        </h1>
        <p className="text-gray-400 mb-8">
          We&apos;re still processing your payment. This usually takes a few
          moments. You can try going to your levels, or return to the home page.
        </p>
        <div className="space-y-3">
          <Button onClick={handleContinue} className="w-full">
            Try Accessing Levels
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-gray-600 hover:bg-gray-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
