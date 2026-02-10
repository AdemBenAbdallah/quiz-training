import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

// Generate SEO-friendly certificate descriptions
export function generateCertificateDescription(certName: string): string {
  const descriptions: Record<string, string> = {
    "AWS Certified Cloud Practitioner":
      "Master the CLF-C02 exam with our fast-track practice questions. Get AWS certified in 7 days with proven study methods and 95% pass rate.",
    "AWS Certified Solutions Architect - Associate":
      "Ace the SAA-C03 exam with comprehensive practice tests. Realistic questions covering architecture design, deployment, and security.",
    "AWS Certified Solutions Architect - Professional":
      "Master the SAP-C02 exam with advanced practice scenarios. Expert-level questions for experienced architects.",
    "AWS Certified Developer Associate":
      "Pass the DVA-C02 exam with our developer-focused practice questions. Covers AWS services, CI/CD, and application development.",
    "AWS Certified Advanced Networking - Specialty":
      "Prepare for ANS-C01 with advanced networking practice tests. Covers hybrid network architectures and VPC configurations.",
    "AWS Certified Machine Learning - Specialty":
      "Master MLS-C01 with ML-focused practice questions. Covers ML pipelines, SageMaker, and AI services.",
    "AWS Certified AI Practitioner":
      "Prepare for AIF-C01 with AI/ML practice tests. Covers generative AI, prompt engineering, and AWS AI services.",
    "AWS Certified DevOps Engineer - Professional":
      "Ace DOP-C02 with DevOps practice questions. Covers CI/CD pipelines, monitoring, and automation.",
    "AWS Certified Security - Specialty":
      "Master SCS-C02 with security-focused practice tests. Covers IAM, encryption, and security best practices.",
    "AWS Certified Data Engineer - Associate":
      "Prepare for DEA-C01 with data engineering practice questions. Covers data pipelines, analytics, and storage.",
    "AWS Certified Machine Learning Engineer - Associate":
      "Master MLA-C01 with ML engineering practice tests. Covers ML workflows, SageMaker, and MLOps.",
  };

  return (
    descriptions[certName] ||
    `Prepare for the ${certName} exam with our comprehensive practice questions. Get certified fast with CertQuickly's proven study method.`
  );
}

// Generate JSON-LD structured data for certificates
export function generateCertificateSchema(certName: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${certName} Fast Track`,
    description: generateCertificateDescription(certName),
    url,
    provider: {
      "@type": "Organization",
      name: "CertQuickly",
      url: "https://certquickly.com",
    },
    educationalLevel: "Intermediate",
    courseMode: "online",
    coursePrerequisites: "Basic AWS knowledge recommended",
    educationalCredentialAwarded: certName,
  };
}
