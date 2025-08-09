# Test Suite for Five-Option Flow Implementation

This directory contains tests for verifying the five-option flow (A-E) changes implemented in the Quiz component and associated APIs.

## Test Files

### 1. Unit Tests
- `quiz-five-options.test.ts`: Validates the schemas and data structure for five options (A-E)
  - Ensures question schema accepts up to five options
  - Verifies rejection of more than five options
  - Tests for minimum required options (two)

### 2. Integration Tests
- `integration/QuizIntegration.test.ts`: Tests the integration of Choice type constraints
  - Verifies that Choice type only allows A-E options
  - Tests handling of five options in a quiz question

### 3. Data Processing Tests
- `choices-limiter.test.ts`: Tests the auto-trimming feature for quiz questions
  - Verifies that questions with more than five options are trimmed
  - Tests console warning is displayed when trimming occurs
  - Ensures questions with five or fewer options remain unchanged

### 4. API Tests
- `api-route.test.ts`: Tests the API schema for five options in explain-question route
  - Validates schema with all five options A-E
  - Rejects invalid option labels (e.g., "F")
  - Tests each valid option label individually
  - Mocks AI response construction for five options

## Running Tests

Run all tests with:

```sh
pnpm test
```

Run tests in watch mode during development:

```sh
pnpm test:watch
```

## Test Coverage

These tests ensure:
1. The UI only allows for five choices (A-E)
2. API routes handle five options correctly
3. Data ingestion trims to five choices when needed
4. The schema validation enforces the five-option limit

## Implementation Notes

The five-option flow implementation includes:
- Modified Choice type: "A" | "B" | "C" | "D" | "E" (removed "F")
- Updated QuestionCard component to render five options
- Updated API route schema to accept only A-E choices
- Added data ingestion guard that trims to five choices

## GitHub Actions CI Workflow

Tests are automatically run on pull requests through the GitHub Actions workflow in `.github/workflows/ci.yml`.
