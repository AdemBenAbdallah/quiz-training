import type { MetadataRoute } from "next";
import { getAvailableCertificates } from "@/lib/certificates";
import { certificateLevels } from "@/public/quiz";

const URL = "https://certquickly.com";

// Blog posts data - can be expanded with a CMS or database
const blogPosts = [
	{
		slug: "how-to-pass-aws-cloud-practitioner-in-7-days",
		title: "How to Pass AWS Cloud Practitioner (CLF-C02) in 7 Days",
		date: "2025-12-01",
	},
	{
		slug: "aws-solutions-architect-associate-study-guide",
		title: "Complete AWS Solutions Architect Associate (SAA-C03) Study Guide",
		date: "2025-11-15",
	},
	{
		slug: "fast-track-aws-certification-tips",
		title: "10 Tips to Get AWS Certified Fast",
		date: "2025-11-01",
	},
	{
		slug: "aws-developer-associate-exam-preparation",
		title: "AWS Developer Associate (DVA-C02) Exam Preparation Strategy",
		date: "2025-10-20",
	},
];

export default function sitemap(): MetadataRoute.Sitemap {
	const certificates = getAvailableCertificates();
	const entries: MetadataRoute.Sitemap = [
		// Home page - highest priority
		{
			url: URL,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		// Certificates catalog
		{
			url: `${URL}/certificates`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		// Static pages
		{
			url: `${URL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${URL}/pricing`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
	];

	// Add individual certificate level pages
	for (const cert of certificates) {
		const levels =
			certificateLevels[cert.slug as keyof typeof certificateLevels];
		if (levels) {
			// Add the main certificate page
			entries.push({
				url: `${URL}/${cert.slug}/levels`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.85,
			});

			// Add individual quiz level pages
			for (let i = 0; i < levels.length; i++) {
				entries.push({
					url: `${URL}/quiz/${cert.slug}/level/${i + 1}`,
					lastModified: new Date(),
					changeFrequency: "weekly",
					priority: 0.7,
				});
			}
		}
	}

	// Add blog post pages
	for (const post of blogPosts) {
		entries.push({
			url: `${URL}/blog/${post.slug}`,
			lastModified: new Date(post.date),
			changeFrequency: "monthly",
			priority: 0.7,
		});
	}

	return entries;
}
