"use client";

import { useClientProvider } from "./client-provider";

export function UrgencyBannerLink() {
  const { setOpenSignUp } = useClientProvider();

  return (
    <button
      type="button"
      onClick={() => setOpenSignUp(true)}
      className="text-red-700 font-semibold hover:underline cursor-pointer bg-transparent p-0"
    >
      Get Discount →
    </button>
  );
}
