import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Footer from "@/components/footer/Footer";
import { ClientProvider } from "@/components/landing/client-provider";
import { auth } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";

// Blog posts content data - can be moved to a CMS or database
const blogPosts: Record<
	string,
	{
		title: string;
		excerpt: string;
		content: string;
		date: string;
		category: string;
		readTime: string;
		keywords: string[];
	}
> = {
	"how-to-pass-aws-cloud-practitioner-in-7-days": {
		title: "How to Pass AWS Cloud Practitioner (CLF-C02) in 7 Days",
		excerpt:
			"Discover our proven 7-day study plan to pass the AWS Cloud Practitioner exam. Includes practice questions, key topics, and time management tips.",
		date: "2025-12-01",
		category: "AWS Cloud Practitioner",
		readTime: "8 min read",
		keywords: [
			"AWS Cloud Practitioner",
			"CLF-C02",
			"pass AWS exam",
			"fast AWS certification",
			"AWS practice questions",
		],
		content: `
## Introduction

Passing the AWS Cloud Practitioner (CLF-C02) exam in just 7 days is achievable with the right strategy. At CertQuickly, we've helped thousands of students get certified with our proven fast-track method.

## The 7-Day Study Plan

### Day 1-2: Fundamentals
Focus on AWS core services and the shared responsibility model. Understand:
- AWS global infrastructure (regions, availability zones, edge locations)
- AWS Support plans
- Basic AWS pricing principles

### Day 3-4: Core Services
Master the three main service categories:
- **Compute**: EC2, Lambda, Elastic Beanstalk
- **Storage**: S3, EBS, EFS
- **Database**: RDS, DynamoDB

### Day 5: Security and Compliance
Deep dive into:
- IAM (users, groups, roles, policies)
- AWS Organizations
- Compliance frameworks

### Day 6-7: Practice Exams
Take multiple practice tests and review incorrect answers.

## Key Topics to Focus On

1. **AWS Well-Archit Framework**
2. **Cost Management** (EC2, S3 cost optimization)
3. **Security Best Practices**
4. **Cloud Concepts** (benefits, agility, elasticity)

## Conclusion

With dedicated study and our practice questions, you can pass the CLF-C02 exam in 7 days. Start your journey today!
    `,
	},
	"aws-solutions-architect-associate-study-guide": {
		title: "Complete AWS Solutions Architect Associate (SAA-C03) Study Guide",
		excerpt:
			"Comprehensive study guide for the AWS Solutions Architect Associate exam. Covers all exam topics with practice questions and hands-on labs.",
		date: "2025-11-15",
		category: "AWS Solutions Architect",
		readTime: "12 min read",
		keywords: [
			"AWS Solutions Architect",
			"SAA-C03",
			"AWS architecture",
			"AWS certification guide",
			"practice questions",
		],
		content: `
## Introduction

The AWS Solutions Architect Associate (SAA-C03) exam tests your ability to design distributed systems on AWS. This comprehensive guide covers everything you need to know.

## Exam Domains

### Domain 1: Design Secure Architectures (30%)
- IAM roles and policies
- Security groups and NACLs
- Encryption options

### Domain 2: Design Resilient Architectures (26%)
- Multi-tier architectures
- High availability patterns
- Disaster recovery strategies

### Domain 3: Design Performant Architectures (24%)
- Performance optimization
- Caching strategies
- Database selection

### Domain 4: Design Cost-Optimized Architectures (10%)
- Cost-effective storage
- Right-sizing resources
- Reserved instances

### Domain 5: Design Operationally Excellent Architectologies (10%)
- Monitoring and logging
- Infrastructure as Code

## Recommended Resources

1. **AWS Documentation** - Read service FAQs
2. **Practice Exams** - Take multiple tests on CertQuickly
3. **Hands-on Labs** - Build real architectures

## Conclusion

Pass the SAA-C03 exam with our comprehensive practice questions and detailed explanations. Good luck!
    `,
	},
	"fast-track-aws-certification-tips": {
		title: "10 Tips to Get AWS Certified Fast",
		excerpt:
			"Learn the secrets to passing AWS certification exams quickly. Our students share their strategies for fast-track certification success.",
		date: "2025-11-01",
		category: "Study Tips",
		readTime: "6 min read",
		keywords: [
			"AWS certification tips",
			"fast AWS certification",
			"pass AWS exam",
			"AWS study strategy",
		],
		content: `
## Introduction

Getting AWS certified doesn't have to take months. Here are our top 10 tips to accelerate your certification journey.

## 10 Tips for Fast AWS Certification

### 1. Start with Practice Exams
Take diagnostic tests to identify knowledge gaps early.

### 2. Focus on High-Weight Topics
Prioritize domains with higher exam weighting.

### 3. Use Quality Resources
Stick to AWS documentation and trusted study guides.

### 4. Hands-on Practice
Build real projects to reinforce concepts.

### 5. Join Study Groups
Learn from others and stay motivated.

### 6. Schedule Your Exam
Set a firm date to create urgency.

### 7. Review Incorrect Answers
Learn from your mistakes on practice tests.

### 8. Understand, Don't Memorize
Focus on understanding AWS services deeply.

### 9. Take Breaks
Avoid burnout with regular study breaks.

### 10. Trust the Process
Stay consistent and confident.

## Conclusion

With these strategies, you can get AWS certified in weeks, not months. Start your fast-track journey today!
    `,
	},
	"aws-developer-associate-exam-preparation": {
		title: "AWS Developer Associate (DVA-C02) Exam Preparation Strategy",
		excerpt:
			"Master the AWS Developer Associate exam with our comprehensive preparation strategy. Covers CI/CD, Lambda, and application development.",
		date: "2025-10-20",
		category: "AWS Developer",
		readTime: "10 min read",
		keywords: [
			"AWS Developer Associate",
			"DVA-C02",
			"AWS CI/CD",
			"Lambda",
			"AWS certification",
		],
		content: `
## Introduction

The AWS Developer Associate (DVA-C02) exam focuses on development and deployment on AWS. This guide helps you prepare effectively.

## Key Exam Topics

### CI/CD Pipelines
- CodePipeline configuration
- CodeBuild and CodeDeploy
- Deployment strategies (blue-green, canary)

### Serverless Development
- Lambda function best practices
- API Gateway integration
- DynamoDB patterns

### Application Development
- SDK usage
- Error handling
- Local development with SAM

## Preparation Strategy

1. **Week 1**: Core AWS services for developers
2. **Week 2**: CI/CD and deployment
3. **Week 3**: Serverless development
4. **Week 4**: Practice exams and review

## Conclusion

Master the DVA-C02 exam with our developer-focused practice questions and hands-on labs.
    `,
	},
};

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = blogPosts[slug];

	if (!post) {
		return {
			title: "Blog Post Not Found | CertQuickly",
			description: "This blog post could not be found.",
		};
	}

	return {
		title: `${post.title} | CertQuickly`,
		description: post.excerpt,
		keywords: post.keywords.join(", "),
		openGraph: {
			title: post.title,
			description: post.excerpt,
			url: absoluteUrl(`/blog/${slug}`),
			type: "article",
			publishedTime: post.date,
			authors: ["CertQuickly Team"],
			section: post.category,
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.excerpt,
		},
		alternates: {
			canonical: `https://certquickly.com/blog/${slug}`,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = blogPosts[slug];

	if (!post) {
		notFound();
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Simple markdown-like rendering
	const contentSections: {
		id: string;
		type: string;
		content: string;
		title?: string;
	}[] = post.content.split("\n## ").map((section, index) => {
		if (index === 0)
			return {
				id: index.toString(),
				type: "paragraph",
				content: section,
			};
		const [title, ...lines] = section.split("\n");
		return {
			id: index.toString(),
			type: "section",
			title: title.trim(),
			content: lines.join("\n").trim(),
		};
	});

	return (
		<ClientProvider session={session}>
			<div className="relative min-h-screen text-white">
				<div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
				<div className="relative container mx-auto px-4 py-16">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-gray-400 mb-8 max-w-4xl mx-auto">
						<Link href="/" className="hover:text-gray-200 transition-colors">
							Home
						</Link>
						<span>/</span>
						<Link
							href="/blog"
							className="hover:text-gray-200 transition-colors"
						>
							Blog
						</Link>
						<span>/</span>
						<span className="text-gray-200">{post.title}</span>
					</div>

					{/* Article Header */}
					<header className="max-w-4xl mx-auto text-center mb-12">
						<div className="flex items-center justify-center gap-3 text-sm text-gray-400 mb-6">
							<span className="text-red-400 font-medium">{post.category}</span>
							<span>•</span>
							<span>{post.date}</span>
							<span>•</span>
							<span>{post.readTime}</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
							{post.title}
						</h1>
						<p className="text-xl text-gray-300 leading-relaxed">
							{post.excerpt}
						</p>
					</header>

					{/* Article Content */}
					<article className="max-w-3xl mx-auto prose prose-invert prose-lg">
						<div className="space-y-6">
							{contentSections.map((section) => (
								<div key={`section-${section.id}`}>
									{section.type === "paragraph" ? (
										<p className="text-gray-300 leading-relaxed">
											{section.content}
										</p>
									) : (
										<>
											<h2 className="text-2xl font-bold mt-8 mb-4 text-white">
												{section.title}
											</h2>
											<div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
												{section.content}
											</div>
										</>
									)}
								</div>
							))}
						</div>
					</article>

					{/* CTA Section */}
					<div className="text-center mt-16">
						<div className="bg-neutral/10 border border-neutral/20 rounded-3xl p-12 max-w-3xl mx-auto">
							<h2 className="text-2xl font-bold mb-4">
								Ready to Get AWS Certified?
							</h2>
							<p className="text-gray-300 mb-6">
								Start practicing with our comprehensive AWS certification
								questions.
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
