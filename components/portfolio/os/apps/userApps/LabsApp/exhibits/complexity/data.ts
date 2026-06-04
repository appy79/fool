import type { LabInsight, LabInsightStep, LabScenarioBase } from "../../types";

type ComplexityScenario = LabScenarioBase & {
  searchNodes: number;
  insightSteps: readonly LabInsightStep[];
};

export const complexityScenarios = [
  {
    id: "tsp",
    name: "Route Search",
    trigger: "Explore routes",
    summary:
      "A tiny fixed-start traveling-salesperson tour looks simple, but brute-force permutations explode quickly.",
    searchNodes: 6,
    metrics: [
      { label: "Verify one route", value: "O(n)" },
      { label: "Brute force", value: "O(n!)" },
      { label: "Lesson", value: "Search explodes" },
    ],
    insightSteps: [
      {
        title: "Start at city A",
        description: "The root represents one route prefix before choosing the next city.",
      },
      {
        title: "Follow one candidate branch",
        description:
          "A higher-cost branch fades while one candidate tour prefix through C stays active.",
      },
      {
        title: "Extend the tour by edge cost",
        description:
          "Each kept route adds another weighted edge, so scoring one tour remains compact.",
      },
      {
        title: "Close and score one tour",
        description:
          "The bottom check sums the chosen edges plus the closing edge back to A, while the factorial search remains the hard part.",
      },
    ],
  },
  {
    id: "sat",
    name: "Constraint Search",
    trigger: "Try assignments",
    summary:
      "A satisfying assignment can be checked quickly, but finding one may require exploring many branches.",
    searchNodes: 8,
    metrics: [
      { label: "Verify witness", value: "Poly / linear in formula" },
      { label: "Naive search", value: "2^n" },
      { label: "Lesson", value: "P vs NP" },
    ],
    insightSteps: [
      {
        title: "Start with the formula",
        description: "The root represents a constraint system before any variables are assigned.",
      },
      {
        title: "Assign x1 and prune conflicts",
        description: "A violating assignment fades while a partial witness remains viable.",
      },
      {
        title: "Assign x2 and x3",
        description: "The tree grows exponentially, but the chosen witness path stays narrow.",
      },
      {
        title: "Verify satisfied clauses",
        description:
          "The bottom checks validate the witness quickly without enumerating every assignment.",
      },
    ],
  },
] as const satisfies readonly ComplexityScenario[];

export const labInsight = {
  steps: [
    {
      title: "Start from one candidate root",
      description:
        "The search begins with a route start or formula before any branching choices are made.",
    },
    {
      title: "First choice narrows the path",
      description:
        "The animation compares a rejected branch with one partial candidate path that remains viable.",
    },
    {
      title: "Search keeps branching",
      description: "Each deeper level shows more alternatives while the witness path stays small.",
    },
    {
      title: "Verification is compact",
      description:
        "The bottom checks show the selected tour cost or satisfied clauses without exploring every branch.",
    },
  ],
  concepts: [
    {
      title: "Search versus verification",
      description: "Many hard problems have witnesses that are easy to check but hard to discover.",
      bullets: [
        "Route search compares many possible tours before finding a low-cost path.",
        "Constraint search explores assignments until every clause is satisfied.",
        "Verification follows one proposed witness and avoids enumerating the full search tree.",
      ],
    },
    {
      title: "Growth rates matter",
      description:
        "The practical limit is often the shape of the search space, not implementation speed.",
      bullets: [
        "Fixed-start TSP-style brute force grows factorially with the remaining cities.",
        "SAT-style assignment search grows exponentially with the number of Boolean variables.",
        "Recognizing these limits is key to choosing heuristics, pruning, approximation, or reformulation.",
      ],
    },
  ],
} satisfies LabInsight;
