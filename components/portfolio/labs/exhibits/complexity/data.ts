export const complexityScenarios = [
  {
    id: "tsp",
    name: "Route Search",
    trigger: "Explore routes",
    summary: "A tiny traveling-salesperson style route looks simple, but brute-force permutations explode quickly.",
    verifyPath: ["A", "C", "D", "B"],
    searchNodes: 24,
    depthLabels: ["Start", "2 choices", "6 routes", "24 routes"],
    metrics: [
      { label: "Verify one route", value: "O(n)" },
      { label: "Brute force", value: "O(n!)" },
      { label: "Lesson", value: "Search explodes" },
    ],
  },
  {
    id: "sat",
    name: "Constraint Search",
    trigger: "Try assignments",
    summary: "A satisfying assignment can be checked quickly, but finding one may require exploring many branches.",
    verifyPath: ["x1", "x2", "x3", "OK"],
    searchNodes: 32,
    depthLabels: ["Formula", "2 branches", "8 branches", "32 branches"],
    metrics: [
      { label: "Verify witness", value: "Polynomial" },
      { label: "Naive search", value: "2^n" },
      { label: "Lesson", value: "P vs NP" },
    ],
  },
] as const;
