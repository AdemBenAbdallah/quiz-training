# Scripts Directory

This directory contains utility scripts for the AI SDK Preview PDF Support project.

## warm-cache.ts

This script pre-populates the Redis cache with explanations for all quiz questions, improving response times for users.

### What it does

1. **Scans all quiz levels**: Goes through levels 1-8 in the quiz folder
2. **Checks existing cache**: Skips questions that already have cached explanations
3. **Generates explanations**: Uses the same Gemini AI logic as the `/api/explain-question` route
4. **Caches results**: Stores explanations in Redis with 30-day expiration
5. **Progress reporting**: Shows detailed progress and statistics

### Usage

```bash
# Run the cache warming script
pnpm warm-cache
```

or directly:

```bash
pnpm dlx tsx ./scripts/warm-cache.ts
```

### Features

- **Smart caching**: Only generates explanations that don't already exist
- **Error handling**: Continues processing even if some questions fail
- **Rate limiting**: Small delays between requests to avoid API limits  
- **Progress tracking**: Real-time updates on processing status
- **Statistics**: Final report showing totals for cached, generated, and failed questions

### Output Example

```
🚀 Starting cache warming for quiz questions...
📊 Found 856 total questions across 8 levels

📚 Processing Level 1 (107 questions)...
✅ Level 1, Q1: Already cached
🔄 Level 1, Q2: Generating explanation...
💾 Level 1, Q2: Cached successfully
...

🎉 Cache warming completed!
📈 Results:
   • Total questions: 856
   • Already cached: 203  
   • Newly generated: 653
   • Errors: 0

✅ All questions processed successfully!
```

### Environment Requirements

- Redis server must be running and accessible
- Google AI API key must be configured
- All project dependencies installed

### Error Handling

The script will:
- Log detailed error messages for failed questions
- Continue processing remaining questions even if some fail
- Exit with error code 1 if any questions failed to process
- Exit with code 0 if all questions processed successfully

This ensures the cache is warmed with as many explanations as possible, even if there are occasional API or parsing errors.