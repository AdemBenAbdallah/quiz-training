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
export const LevelPartsKey = `levelPart`;
export type TLevelParts = typeof LevelParts;

export const QuizParts = (level: number) => {
  const ranges = [
    [0, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 89],
    [90, 95],
    [96, 105],
  ];

  const data = ranges.map(([start, end], index) => ({
    id: index + 1,
    start,
    end,
    passed: level === 1 && index === 0,
  }));

  return { level, data };
};

export type TQuizParts = ReturnType<typeof QuizParts>;
export const QuizPartsKey = (levelId: number) => `quizPart${levelId}`;
