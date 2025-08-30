"use client";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { CLIENT_PUBLIC_FILES_PATH } from "next/dist/shared/lib/constants";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const name = "name";

  const handleSubmit = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email: email,
        password: pass,
        name,
        callbackURL: "/",
      },
      {
        onRequest: (ctx) => {
          console.log("Sign up request", ctx);
          //show loading
        },
        onSuccess: (ctx) => {
          console.log("Sign up successful", ctx);
        },
        onError: (ctx) => {
          toast.error("Sign up error Please try again later");
        },
      },
    );
  };
  const handleGoogleSignIn = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
    });

    if (error) {
      toast.error("Google sign-in error Please try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-80 p-6 rounded-xl bg-gray-800 shadow-lg border border-orange-300 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          Sign Up
        </h2>
        <Input
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 shadow-md hover:shadow-lg"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200 shadow-md hover:shadow-lg"
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-orange-400 text-gray-900 font-semibold rounded-lg hover:bg-orange-500 transition duration-200 shadow-md hover:shadow-lg"
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 shadow-md hover:shadow-lg"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}
