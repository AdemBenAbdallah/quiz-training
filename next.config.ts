import { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: "asset/resource",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.google.com gstatic.com datafa.st us.i.posthog.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: *.googleusercontent.com gstatic.com data:; " +
              "font-src 'self' data: gstatic.com; " +
              "connect-src 'self' *.google.com *.google-analytics.com *.googletagmanager.com datafa.st us.i.posthog.com api.resend.com; " +
              "frame-src 'self' accounts.google.com; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default withWorkflow(nextConfig);
