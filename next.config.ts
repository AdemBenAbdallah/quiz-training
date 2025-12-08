import { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
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
};

export default withWorkflow(nextConfig);
