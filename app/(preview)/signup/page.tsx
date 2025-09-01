"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/icons/Google";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLink = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.magicLink({
        email,
        name: email.charAt(0).toUpperCase() + email.slice(1),
        callbackURL: "/levels",
        errorCallbackURL: "/error",
      });
    } catch (error) {
      console.error("Magic link error:", error);
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
      <div className="w-full md:w-1/4 p-8 rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col gap-6 relative">
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
