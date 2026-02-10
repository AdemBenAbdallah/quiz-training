import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import { auth } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";

// Blog posts data - can be moved to a CMS or database
const blogPosts = [
	{
		slug: "how-to-pass-aws-cloud-practitioner-in-7-days",
		title: "How to Pass AWS Cloud Practitioner (CLF-C02) in 7 Days",
		excerpt:
			"Discover our proven 7-day study plan to pass the AWS Cloud Practitioner exam. Includes practice questions, key topics, and time management tips.",
		date: "2025-12-01",
		category: "AWS Cloud Practitioner",
		readTime: "8 min read",
	},
	{
		slug: "aws-solutions-architect-associate-study-guide",
		title: "Complete AWS Solutions Architect Associate (SAA-C03) Study Guide",
		excerpt:
			"Comprehensive study guide for the AWS Solutions Architect Associate exam. Covers all exam topics with practice questions and hands-on labs.",
		date: "2025-11-15",
		category: "AWS Solutions Architect",
		readTime: "12 min read",
	},
	{
		slug: "fast-track-aws-certification-tips",
		title: "10 Tips to Get AWS Certified Fast",
		excerpt:
			"Learn the secrets to passing AWS certification exams quickly. Our students share their strategies for fast-track certification success.",
		date: "2025-11-01",
		category: "Study Tips",
		readTime: "6 min read",
	},
	{
		slug: "aws-developer-associate-exam-preparation",
		title: "AWS Developer Associate (DVA-C02) Exam Preparation Strategy",
		excerpt:
			"Master the AWS Developer Associate exam with our comprehensive preparation strategy. Covers CI/CD, Lambda, and application development.",
		date: "2025-10-20",
		category: "AWS Developer",
		readTime: "10 min read",
	},
	{
		slug: "aws-security-specialty-exam-guide",
		title: "AWS Security Specialty (SCS-C02) Exam Guide",
		excerpt:
			"Prepare for the AWS Security Specialty exam with detailed coverage of IAM, encryption, and security best practices.",
		date: "2025-10-10",
		category: "AWS Security",
		readTime: "14 min read",
	},
	{
		slug: "aws-machine-learning-certification-guide",
		title: "AWS Machine Learning Certification Guide",
		excerpt:
			"Complete guide to AWS ML certifications (MLS-C01 and MLA-C01). Covers SageMaker, AI services, and machine learning workflows.",
		date: "2025-09-25",
		category: "AWS Machine Learning",
		readTime: "11 min read",
	},
];

export const metadata: Metadata = {
	title:
		"AWS Certification Blog | Tips, Study Guides & Strategies - CertQuickly",
	description:
		"Expert guides and study tips for AWS certification exams. Learn how to pass AWS Cloud Practitioner, Solutions Architect, Developer, and Specialty exams faster.",
	openGraph: {
		title: "AWS Certification Blog | Tips, Study Guides & Strategies",
		description:
			"Expert guides and study tips for AWS certification exams. Pass your AWS certification faster.",
		url: absoluteUrl("/blog"),
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AWS Certification Blog | Tips & Study Guides",
		description: "Expert guides and study tips for AWS certification exams.",
	},
	alternates: {
		canonical: "https://certquickly.com/blog",
	},
};

export default async function BlogPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<ClientProvider session={session}>
			<div className="relative min-h-screen text-white">
				<div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
				<div className="relative container mx-auto px-4 py-16">
					{/* Header */}
					<div className="text-center space-y-6 mb-16">
						<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
							<span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
								AWS Certification Blog
							</span>
						</h1>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Expert guides, study tips, and strategies to help you pass AWS
							certification exams faster. Learn from our 95% pass rate success.
						</p>
					</div>

					{/* Blog Posts Grid */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
						{blogPosts.map((post) => (
							<article
								key={post.slug}
								className="bg-neutral/10 border border-neutral/20 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300"
							>
								<div className="space-y-4">
									<div className="flex items-center gap-3 text-sm text-gray-400">
										<span className="text-red-400 font-medium">
											{post.category}
										</span>
										<span>•</span>
										<span>{post.date}</span>
										<span>•</span>
										<span>{post.readTime}</span>
									</div>
									<h2 className="text-xl font-bold leading-tight group">
										<Link
											href={`/blog/${post.slug}`}
											className="hover:text-red-400 transition-colors"
										>
											{post.title}
										</Link>
									</h2>
									<p className="text-gray-400 leading-relaxed">
										{post.excerpt}
									</p>
									<Link
										href={`/blog/${post.slug}`}
										className="inline-flex items-center text-red-400 font-medium hover:text-red-300 transition-colors"
									>
										Read More →
									</Link>
								</div>
							</article>
						))}
					</div>

					{/* CTA Section */}
					<div className="text-center mt-20">
						<div className="bg-neutral/10 border border-neutral/20 rounded-3xl p-12 max-w-4xl mx-auto">
							<h2 className="text-3xl font-bold mb-4">
								Ready to Get AWS Certified?
							</h2>
							<p className="text-gray-300 mb-6">
								Start your fast-track certification journey today with our
								comprehensive practice questions and study materials.
							</p>
							<Link
								href="/certificates"
								className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-500 transition-colors"
							>
								Explore Certifications
							</Link>
						</div>
					</div>
				</div>
				<Suspense fallback={<div>Loading...</div>}>
					<Footer />
				</Suspense>
			</div>
		</ClientProvider>
	);
}
