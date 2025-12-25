interface AnalyticsConfig {
  googleAds: {
    id: string;
  };
  dataFast: {
    id: string;
    domain: string;
  };
  posthog: {
    key: string;
    host: string;
  };
}

export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    googleAds: {
      id: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-17695424239",
    },
    dataFast: {
      id: process.env.NEXT_PUBLIC_DATAFAST_ID || "dfid_eTpQ5NjrKpI9SsZkJ4rgy",
      domain: process.env.NEXT_PUBLIC_DATAFAST_DOMAIN || "certquickly.com",
    },
    posthog: {
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    },
  };
}

/**
 * Get environment variables for analytics setup
 * This is useful for server-side rendering or API routes
 */
export function getAnalyticsEnvVars() {
  return {
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
    dataFastId: process.env.NEXT_PUBLIC_DATAFAST_ID,
    dataFastDomain: process.env.NEXT_PUBLIC_DATAFAST_DOMAIN,
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  };
}
