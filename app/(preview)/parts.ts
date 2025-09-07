import { quizLevels } from "@/quiz";

export const LevelParts = [
  {
    id: 1,
    passed: true,
  },
  {
    id: 2,
    passed: false,
  },
  {
    id: 3,
    passed: false,
  },
  {
    id: 4,
    passed: false,
  },
  {
    id: 5,
    passed: false,
  },
  {
    id: 6,
    passed: false,
  },
  {
    id: 7,
    passed: false,
  },
  {
    id: 8,
    passed: false,
  },
];
export const LevelPartsKey = `levelParts`;
export type TLevelParts = typeof LevelParts;

export const QuizParts = (level: number) => {
  const quizLevel = quizLevels[level - 1];
  const totalQuestions = quizLevel?.length || 0;

  // calculate questions per part (8 parts total)
  const QUESTIONS_PER_PART = Math.ceil(totalQuestions / 8);

  const ranges: [number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const start = i * QUESTIONS_PER_PART;
    const end = Math.min(start + QUESTIONS_PER_PART - 1, totalQuestions - 1);

    if (start < totalQuestions) {
      ranges.push([start, end]);
    }
  }

  // add the "all questions" range as the last part
  if (totalQuestions > 0) {
    ranges.push([0, totalQuestions - 1]);
  }

  const data = ranges.map(([start, end], index) => ({
    id: index + 1,
    start,
    end,
    passed: index === 0, // mark first as passed?
  }));

  return { level, data, QUESTIONS_PER_PART };
};
export type TQuizParts = ReturnType<typeof QuizParts>;
export const QuizPartsKey = (levelId: number) => `quizPart${levelId}`;
