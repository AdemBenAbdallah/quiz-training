export interface Certificate {
  id: string;
  slug: string;
  name: string;
  description?: string;
  totalLevels: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateMetadata {
  slug: string;
  name: string;
  description: string;
  totalLevels: number;
  questionsPerLevel: number[];
  levels: Record<string, number>;
  heroTitle: string;
  heroDescription: string;
  badgeColor: string;
  lastUpdated: string;
}

export interface CertificateQuestion {
  url: string;
  question_number: string;
  question: string;
  choices: string[];
  answers: string[];
}

export interface CertificateLevel {
  level: number;
  questions: CertificateQuestion[];
  totalQuestions: number;
}

export interface CertificateConfig {
  metadata: CertificateMetadata;
  levels: CertificateLevel[];
}
