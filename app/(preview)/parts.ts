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
  const QUESTIONS_PER_PART = Math.ceil(quizLevel.length / 8);

  const ranges = [
    [0, 8],
    [9, 17],
    [18, 26],
    [27, 35],
    [36, 44],
    [45, 53],
    [54, 62],
    [63, 71],
    [0, 71],
  ];

  const data = ranges.map(([start, end], index) => ({
    id: index + 1,
    start,
    end,
    passed: level === 1 && index === 0,
  }));

  return { level, data, QUESTIONS_PER_PART };
};

export type TQuizParts = ReturnType<typeof QuizParts>;
export const QuizPartsKey = (levelId: number) => `quizPart${levelId}`;
