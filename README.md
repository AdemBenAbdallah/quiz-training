# Quiz Training App

A comprehensive quiz training platform for cloud certification preparation, featuring interactive quizzes, progress tracking, and AI-powered service information.

## 🚀 Deployment

### Vercel Deployment

This app is designed to deploy seamlessly to Vercel:

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GEMINI_API_KEY`
   - `REDIS_URL`
3. **Build command**: `bun run build`
4. **Output directory**: `.next`

### Python Scripts

The `py-scraping/` directory contains development tools for adding new certificates. These Python scripts:

- Are **ignored during Vercel deployment**
- Run locally to generate quiz content
- Create static JSON files used by the frontend
- Do NOT affect production deployment

**To add new certificates:**

```bash
cd py-scraping
uv run python web_scraper.py
uv run python process_certificate.py NEW-CERT
uv run python integrate_certificate.py NEW-CERT
```

**Note**: Only commit the generated JSON files to GitHub, not the Python scripts (they're in `.gitignore`).

## Features

- **Multi-Certificate Support**: Prepare for multiple cloud certifications (AWS Developer, Azure, GCP, etc.)
- **Interactive Quizzes**: Dynamic question sets with multiple choice and detailed explanations
- **Progress Tracking**: Monitor your learning progress across levels and certificates
- **AI-Powered Service Info**: Get detailed information about AWS services directly in questions
- **User Authentication**: Secure login with email magic links
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 18+
- Bun runtime
- PostgreSQL database
- Redis (for caching)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd quiz-training
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:

```bash
bun run db:push
bun run seed:certificates
```

5. Start the development server:

```bash
bun run dev
```

### Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Your app URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `REDIS_URL`: Redis connection URL

## Usage

### Taking Quizzes

1. Visit the certificates page to choose your certification path
2. Select a level to start practicing
3. Answer questions and get instant feedback
4. Use the "Service Info" button to learn about AWS services

### Progress Tracking

- View your progress on the dashboard
- Track completion across different levels
- Resume where you left off

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── certificates/      # Certificate selection
│   └── quiz/              # Quiz pages
├── components/            # React components
├── docs/                  # Documentation
├── lib/                   # Utility libraries
├── public/                # Static assets
├── scripts/               # Utility scripts
└── types/                 # TypeScript types
```

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run test` - Run tests
- `bun run lint` - Run ESLint
- `bun run db:push` - Push database schema
- `bun run seed:certificates` - Seed certificate data

### Testing

```bash
bun test
```

### Adding New Certificates

1. Create certificate folder in `public/quiz/`
2. Add metadata.json with certificate details
3. Add level JSON files
4. Update certificates index
5. Run seed script

## Documentation

- [AI SDK Migration](docs/AI-SDK-MIGRATION.md) - Migration from generateText to generateObject
- [Service Info Feature](docs/FEATURE_SERVICE_INFO.md) - AI-powered service information system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Your License Here]

## Support

For questions or issues, please open an issue on GitHub.
