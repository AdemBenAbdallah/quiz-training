import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // The docs recommend this to avoid hydration errors
    capture_pageview: false,
    // The docs recommend this for SPAs
    capture_pageleave: true,
  });
}
