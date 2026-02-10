import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/api/",
				"/private/",
				"/workflow-dashboard/",
				"/payment/success",
			],
		},
		sitemap: "https://certquickly.com/sitemap.xml",
		host: "certquickly.com",
	};
}
