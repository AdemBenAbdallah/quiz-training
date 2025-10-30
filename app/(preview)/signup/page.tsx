"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/icons/Google";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMagicLink = async () => {
    if (!email) return;
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const { data, error } = await authClient.signIn.magicLink({
        email,
        name: email.charAt(0).toUpperCase() + email.slice(1),
        callbackURL: "/levels",
        errorCallbackURL: "/error",
      });

      if (error) {
        setErrorMessage(
          // @ts-ignore - some clients return string errors
          typeof error === "string"
            ? error
            : ((error as any)?.message ?? "Failed to send magic link."),
        );
      } else {
        setSuccessMessage(
          `We sent a sign-in link to ${email}. Please check your inbox to continue.`,
        );
      }
    } catch (error: any) {
      console.error("Magic link error:", error);
      setErrorMessage(
        error?.message ??
          "Something went wrong sending the magic link. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/levels",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Subtle background pattern similar to quiz interface */}
      {/*<div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-red-500/10 to-transparent"></div>
      </div>*/}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />

      {/* Main signup card */}
      <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-8 rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col gap-6 relative">
        {/* Subtle red glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/5 to-red-900/5 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Join the Quiz
          </h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            Start your AWS certification journey
          </p>

          {/* Email input with enhanced styling */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                className="w-full px-4 py-6 rounded-xl bg-gray-800/70 text-white placeholder-gray-500 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300 shadow-inner hover:bg-gray-800/90 text-base"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Primary CTA button with quiz-like styling */}
            <button
              onClick={handleMagicLink}
              disabled={!email || isLoading}
              className="w-full py-3 bg-red-600 to-red-900 text-gray-900 font-bold rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  <span>Starting...</span>
                </div>
              ) : (
                <span className="text-white">Sign Up with email</span>
              )}
            </button>

            {successMessage && (
              <div className="rounded-xl border border-red-400/40 bg-gray-900/70 text-gray-200 p-3">
                <p className="text-sm">{successMessage}</p>
                <p className="text-xs text-gray-400 mt-1">
                  If you don&apos;t see it, check your spam folder. The link
                  expires in 15 minutes.
                </p>
              </div>
            )}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/60 bg-red-950/50 text-red-200 p-3">
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative bg-gray-900 px-4">
                <span className="text-gray-500 text-sm">or</span>
              </div>
            </div>

            {/* Google sign in button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 bg-gray-800/70 text-white font-semibold rounded-xl border border-gray-600/50 hover:bg-gray-700/80 hover:border-gray-500/50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-base"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          {/* Footer text */}
          <p className="text-gray-500 text-xs text-center mt-6">
            By signing up, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
