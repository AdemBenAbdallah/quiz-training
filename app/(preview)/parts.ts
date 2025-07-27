export const QuizParts = [
  {
    id: 1,
    start: 0,
    end: 9,
    passed: true
  },
  {
    id: 2,
    start: 10,
    end: 19,
    passed: false
  },
  {
    id: 3,
    start: 20,
    end: 29,
    passed: false
  },
  {
    id: 4,
    start: 30,
    end: 39,
    passed: false
  },
  {
    id: 5,
    start: 40,
    end: 49,
    passed: false
  },
  {
    id: 6,
    start: 50,
    end: 59,
    passed: false
  },
  {
    id: 7,
    start: 60,
    end: 69,
    passed: false
  },
  {
    id: 8,
    start: 70,
    end: 79,
    passed: false
  },
  {
    id: 9,
    start: 80,
    end: 89,
    passed: false
  },
  {
    id: 10,
    start: 90,
    end: 95,
    passed: false
  },
  {
    id: 11,
    start: 0,
    end: 95,
    passed: false
  }
];

export type QuizPart = (typeof QuizParts)[number];
