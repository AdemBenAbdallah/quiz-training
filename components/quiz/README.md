# Quiz Component Architecture

This document describes the refactored quiz component architecture that follows SOLID principles for better maintainability, testability, and separation of concerns.

## Overview

The quiz system has been broken down into smaller, focused components and custom hooks that each handle a specific responsibility:

## Architecture

### 🎯 Core Components

#### `QuizContainer`
- **Responsibility**: Main orchestrator that coordinates all quiz functionality
- **Dependencies**: All hooks and child components
- **Purpose**: Implements the composition pattern to bring together all quiz features

#### `QuizHeader`
- **Responsibility**: Displays quiz title and actions
- **Dependencies**: CopyButton component
- **Purpose**: Simple presentation component for quiz header

#### `QuizNavigation`
- **Responsibility**: Handles quiz navigation UI (Previous/Next buttons, progress indicator)
- **Dependencies**: Navigation hook data
- **Purpose**: Pure UI component for navigation controls

#### `QuizActions`
- **Responsibility**: Post-completion actions (Reset, View All Parts)
- **Dependencies**: None (receives callbacks as props)
- **Purpose**: Reusable action buttons component

### 🪝 Custom Hooks

#### `useQuizNavigation`
**Purpose**: Manages quiz navigation state and actions

**State:**
- Current question index
- Progress percentage
- Navigation constraints (can go next/previous)
- Question type identification (last question)

**Actions:**
- `goToNextQuestion()` - Navigate forward or submit quiz
- `goToPreviousQuestion()` - Navigate backward
- `goToQuestion(index)` - Jump to specific question
- `reset()` - Reset navigation state

#### `useQuizState`
**Purpose**: Manages quiz answers, submission state, and scoring

**State:**
- User answers for all questions
- Submission status per question
- Final quiz score
- Quiz completion status

**Actions:**
- `selectAnswer(questionIndex, answer)` - Handle answer selection
- `submitQuestion(questionIndex)` - Mark question as submitted
- `submitQuiz()` - Calculate and return final score
- `resetQuiz()` - Clear all quiz data
- `isQuestionSubmitted(index)` - Check submission status
- `getQuestionAnswers(index)` - Get answers for specific question

#### `useQuizProgression`
**Purpose**: Manages level and part progression with localStorage persistence

**State:**
- Current quiz parts data
- Level parts data
- Part accessibility status
- Last part identification

**Actions:**
- `passToNextPart()` - **FIXED**: Properly unlocks next part or next level's first part
- `resetProgression()` - Reset all progression data

**Key Fix**: When completing the last part of a level:
1. Unlocks the next level in `levelParts`
2. Creates and stores quiz parts for the next level with the **first part unlocked**
3. Uses direct localStorage access to ensure proper persistence

## SOLID Principles Applied

### 🔹 Single Responsibility Principle (SRP)
Each component and hook has one clear responsibility:
- `QuizNavigation` only handles navigation UI
- `useQuizState` only manages quiz answers and scoring
- `useQuizProgression` only handles level/part progression

### 🔹 Open/Closed Principle (OCP)
Components are open for extension but closed for modification:
- New quiz features can be added by creating new hooks
- UI can be extended by composing additional components
- Navigation behavior can be extended without modifying existing code

### 🔹 Liskov Substitution Principle (LSP)
Hook interfaces are consistent and substitutable:
- All state hooks return consistent state/actions patterns
- Components can be swapped without breaking the interface

### 🔹 Interface Segregation Principle (ISP)
Interfaces are focused and minimal:
- Navigation hook only exposes navigation-related methods
- State hook only exposes state-related methods
- Components receive only the props they need

### 🔹 Dependency Inversion Principle (DIP)
High-level components depend on abstractions:
- `QuizContainer` depends on hook interfaces, not implementations
- Components receive callbacks rather than depending on specific implementations

## Usage Example

```tsx
import { Quiz } from "@/components/quiz";

// Simple usage - all complexity is handled internally
<Quiz 
  idx={1}
  levelId={2}
  questions={questions}
  title="Level 2 Quiz"
/>
```

## Key Features

### ✅ Fixed Progression System
- **Before**: Next level opened but first part remained locked
- **After**: When completing a level, the next level's first part is automatically unlocked
- **Implementation**: Direct localStorage manipulation ensures proper persistence

### 🔄 State Management
- Separation of concerns between navigation, quiz state, and progression
- Each hook manages its own slice of state
- Clean reset functionality across all hooks

### 🎨 UI Composition
- Modular components that can be reused
- Clean separation between logic and presentation
- Easy to test individual components

### 📱 Responsive Design
- All components maintain responsive behavior
- Animation and transitions preserved
- Progress indication and navigation controls

## File Structure

```
components/quiz/
├── README.md
├── index.ts                          # Exports
├── components/
│   ├── QuizContainer.tsx            # Main orchestrator
│   ├── QuizHeader.tsx               # Title and actions
│   ├── QuizNavigation.tsx           # Navigation controls
│   └── QuizActions.tsx              # Post-completion actions
└── hooks/
    ├── useQuizNavigation.ts         # Navigation state/actions
    ├── useQuizState.ts              # Quiz answers/scoring
    └── useQuizProgression.ts        # Level/part progression
```

## Testing Strategy

Each component and hook can be tested independently:

1. **Hooks**: Test state changes and action outcomes
2. **Components**: Test rendering and user interactions
3. **Integration**: Test complete user flows through QuizContainer

This architecture makes the quiz system more maintainable, testable, and easier to extend with new features.