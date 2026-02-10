# App First Look: CertQuickly

## What This App Does

**CertQuickly** is a cloud certification preparation platform focused on AWS exams. It provides interactive multi-choice quizzes, progress tracking, and AI-powered explanations to help users pass AWS certification exams.

### Core Features

- **Multi-Certificate Support**: 11 AWS certifications (Developer Associate, Solutions Architect, Security, DevOps, Machine Learning, Data Engineer, etc.)
- **Interactive Quizzes**: 10-question sets per quiz with multiple choice (single/multi-answer), instant feedback, and explanations
- **Progress Tracking**: 3-13 levels per certificate, unlock levels by scoring 80%+
- **AI Service Info**: Google Gemini-powered explanations of AWS services mentioned in questions (cached via Redis)
- **Payments**: DodoPayments integration with 3 tiers (individual/professional/complete)
- **Auth**: Better-Auth with Google OAuth and magic link email

### User Flow

1. User lands on marketing homepage → selects certificate
2. Browses levels (locked until previous passed or purchased)
3. Takes quiz (10 questions, multiple choice with visual feedback)
4. Scores 80%+ → unlocks next level
5. Can access AI service info during quiz for AWS service explanations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | **Bun** 1.3+ |
| Framework | **Next.js 15+** (App Router) |
| Language | **TypeScript** |
| Database | **PostgreSQL** + **Drizzle ORM** |
| Auth | **Better-Auth** |
| Payments | **DodoPayments** |
| AI | **Google Gemini** (via @ai-sdk/google) |
| Caching | **Redis** |
| Styling | **Tailwind CSS** + **Radix UI** |
| Animations | **Framer Motion** |
| Testing | **Vitest** + **React Testing Library** |
| Linting | **ESLint** |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Landing     │  │ Quiz Flow    │  │ User Dashboard      │ │
│  │ (marketing) │  │ (interactive)│  │ (progress tracking) │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                        API Routes                            │
│  /api/auth/*     │  /api/chat-llm    │  /api/service-info   │
│  /api/progress   │  /api/explain-q   │  /api/payment-webhook│
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                     Core Services                            │
│  ┌──────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ Better-Auth  │  │ DodoPayments    │  │ Redis Cache    │  │
│  │ (social/mag) │  │ (subscriptions) │  │ (AI responses) │  │
│  └──────────────┘  └─────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                       Data Layer                             │
│              PostgreSQL (via Drizzle ORM)                    │
│  ┌────────────┐  ┌────────────────  ┌───────────────────┐   │
│  │ users      │  │ user_progress    │  │ user_payments    │   │
│  │ sessions   │  │ certificates     │  │ (purchase history│   │
│  │ accounts   │  │ (seeder data)    │                   │   │
│  └────────────┘  └─────────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
quiz-training/
├── app/                          # Next.js App Router
│   ├── (preview)/                # Main app routes (layout wrapper)
│   │   ├── [certificate]/        # Dynamic certificate pages
│   │   ├── certificates/         # Certificate selection
│   │   ├── level/[id]/           # Quiz level page
│   │   ├── payment/              # Payment flow
│   │   ├── workflow-dashboard/   # Workflow AI dashboard
│   │   └── page.tsx              # Landing page
│   └── api/                      # API routes
│       ├── auth/                 # Better-Auth endpoints
│       ├── chat-llm/             # AI chat assistant
│       ├── service-info/         # AWS service explanations
│       ├── progress/             # Progress tracking
│       └── explain-question/     # Question explanations
├── components/
│   ├── quiz/                     # Quiz components
│   │   ├── QuizContainer.tsx     # Main quiz state machine
│   │   ├── QuizHeader.tsx        # Quiz navigation
│   │   ├── QuizNavigation.tsx    # Question navigation
│   │   └── QuizActions.tsx       # Reset/continue actions
│   ├── certificate-selector/     # Certificate selection UI
│   ├── landing/                  # Landing page components
│   ├── ui/                       # Radix + Tailwind components
│   └── providers/                # Context providers
├── lib/
│   ├── auth.ts                   # Better-Auth configuration
│   ├── certificates.ts           # Static certificate metadata
│   ├── schemas.ts                # Zod validation schemas
│   ├── utils.ts                  # Utility functions
│   ├── selection.ts              # Quiz answer logic
│   ├── redis-cache.ts            # Redis caching layer
│   └── server/                   # Server-side utilities
├── db/
│   ├── schema.ts                 # Drizzle schema definitions
│   └── index.ts                  # Database connection
├── types/
│   ├── quiz.ts                   # Quiz type definitions
│   └── certificate.ts            # Certificate types
├── public/quiz/                  # Static JSON quiz data
│   └── [certificate]/
│       ├── level1.json          # 65-71 questions per level
│       └── ...
├── scripts/                      # CLI scripts (seed, migrate, etc.)
├── docs/                         # Documentation
├── drizzle.config.ts             # Drizzle configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Dependencies

```

## Data Flow: Quiz Execution

```
User clicks answer
       │
       ▼
QuestionCard.tsx (UI)
       │
       ▼
handleAnswerSelection() [lib/selection.ts]
       │
       ▼
update local state (answers[])
       │
       ▼
User submits quiz → QuizContainer.submitQuiz()
       │
       ▼
calculateScore() → 8/10 = 80%
       │
       ├─── Pass (≥80%) ──→ updateProgress() → unlock next level
       │
       └─── Fail (<80%) ──→ show review, retry allowed
```

## Key Design Patterns

### 1. Early Returns for Error Handling

```typescript
// ❌ Avoid nested conditionals
if (user) {
  if (subscription) {
    if (levelAccessible) {
      // do work
    }
  }
}

// ✅ Early returns
if (!user) return null;
if (!subscription) return null;
if (!levelAccessible) return forbidden;

return doWork();
```

### 2. Component Composition

```
QuizContainer (state holder)
├── QuizHeader (nav + actions)
├── QuestionCard (answer UI)
├── QuizNavigation (question picker)
└── QuizReview (results)

```

### 3. API with Zod Validation

```typescript
// Schema defines input shape
export const serviceInfoSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
});

// Handler validates automatically
export async function POST(req: Request) {
  const body = await req.json();
  const { question, options } = serviceInfoSchema.parse(body);
  // ... AI call
}
```

### 4. Redis Caching for AI Responses

```typescript
// Cache AI responses to avoid repeated Gemini calls
const cacheKey = `service:${hash(question)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// ... generate with Gemini, then cache
await redis.setex(cacheKey, 86400, JSON.stringify(result));
```

## Quiz Data Format (JSON)

```json
[
  {
    "question": "A developer is building a serverless application...",
    "options": [
      "Use API Gateway with Lambda",
      "Use S3 static hosting",
      "Use EC2 instances",
      "Use ECS Fargate"
    ],
    "answer": ["A"],
    "questionNumber": "Q1",
    "answerComments": [
      "API Gateway is the correct choice for a serverless API..."
    ]
  }
]
```

## Database Schema (Key Tables)

| Table | Purpose |
|-------|---------|
| `user` | User accounts (email, name, image) |
| `session` | Auth sessions (token, expiry, IP) |
| `account` | OAuth provider links |
| `certificates` | Available certs (DVA-C02, SAA-C03, etc.) |
| `user_level_progress` | Per-certificate level progress |
| `user_payment` | Purchase history, subscription tier |

## Environment Variables

```
# Auth
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET / NEXTAUTH_URL

# Database
DATABASE_URL (PostgreSQL)

# Payments
DODO_PAYMENTS_API_KEY
DODO_PAYMENTS_WEBHOOK_SECRET
NEXT_PUBLIC_DODO_PRODUCT_*

# AI
GEMINI_API_KEY

# Infrastructure
REDIS_URL
RESEND_API_KEY (email)
```

## Commands

```bash
bun run dev           # Development server
bun run build         # Production build
bun run db:push       # Push schema to DB
bun run seed:certificates  # Load cert data
bun run test          # Run tests
bun run lint          # Lint code
```

## Entry Points

| Route | File |
|-------|------|
| `/` | `app/(preview)/page.tsx` |
| `/certificates` | `app/(preview)/certificates/page.tsx` |
| `/quiz/[cert]/[level]` | `app/(preview)/level/[id]/page.tsx` |
| `/payment` | `app/(preview)/payment/page.tsx` |
| `/api/service-info` | `app/api/service-info/route.ts` |

## Important Files

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Better-Auth config + DodoPayments webhook handler |
| `lib/certificates.ts` | Static certificate metadata (11 certs) |
| `components/quiz/QuizContainer.tsx` | Main quiz state machine |
| `lib/selection.ts` | Answer validation logic |
| `components/ServiceInfoDialog.tsx` | AI-powered service explanations |
| `hooks/useProgress.ts` | Progress state + API sync |

## Development Notes

- **Quiz data**: Static JSON files in `public/quiz/[cert]/level*.json`
- **AI caching**: Redis stores service info responses (24h TTL)
- **Payment tiers**: Individual (1 cert) / Professional (3) / Complete (11)
- **Progress gating**: Level N requires Level N-1 passed (≥80%)
- **Testing**: Vitest + React Testing Library in `tests/`

## Tech Debt / Improvements

1. Quiz data hardcoded in JSON files (could be DB-backed)
2. Certificate metadata in `lib/certificates.ts` (static, hard to maintain)
3. No unit tests for quiz logic (`lib/selection.ts`)
4. Redis caching could use pattern-based invalidation
5. Workflow dashboard underutilized
6. No rate limiting on AI endpoints
