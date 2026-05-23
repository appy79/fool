import type { LabInsight, LabScenarioBase } from "../../types";

export type PerformanceProfile = LabScenarioBase & {
  stages: readonly string[];
  bars: readonly [number, number, number];
};

export const performanceProfiles = [
  {
    id: "baseline",
    name: "Baseline Scan",
    trigger: "Run baseline",
    summary: "A direct scan keeps the system simple, but cost grows with input size.",
    stages: ["Input", "Loop", "Memory", "DB scan", "Response"],
    bars: [92, 38, 28],
    metrics: [
      { label: "Latency", value: "420ms" },
      { label: "Memory", value: "High churn" },
      { label: "Complexity", value: "O(n)" },
    ],
    insightSteps: [
      {
        title: "Input enters a direct scan",
        description: "The request starts with the simplest implementation: walk the available data.",
      },
      {
        title: "Loop cost grows with n",
        description: "The hot path spends time repeatedly checking items rather than jumping to the answer.",
      },
      {
        title: "Memory churn appears",
        description: "Intermediate objects and repeated reads create pressure even before the database scan completes.",
      },
      {
        title: "DB scan dominates",
        description: "The slow storage access becomes the main bottleneck for this baseline path.",
      },
      {
        title: "Response exposes baseline latency",
        description: "The result is correct but slow, which gives later optimizations a measured comparison point.",
      },
    ],
  },
  {
    id: "indexed",
    name: "Indexed Query",
    trigger: "Use index",
    summary: "An index trades write/storage cost for faster read paths and fewer scanned rows.",
    stages: ["Input", "Planner", "Index", "Row fetch", "Response"],
    bars: [36, 46, 76],
    metrics: [
      { label: "Latency", value: "95ms" },
      { label: "Rows read", value: "-88%" },
      { label: "Tradeoff", value: "Write cost" },
    ],
    insightSteps: [
      {
        title: "Input reaches the query planner",
        description: "The database has enough structure to choose an indexed access path.",
      },
      {
        title: "Planner picks the index",
        description: "The lookup avoids scanning most rows by using precomputed ordering or hash structure.",
      },
      {
        title: "Index narrows the search",
        description: "The lookup avoids scanning most rows by using precomputed ordering or hash structure.",
      },
      {
        title: "Only matching rows are fetched",
        description: "The row-fetch stage shows why reads get faster while storage and writes become more expensive.",
      },
      {
        title: "Response improves with a write tradeoff",
        description: "The final bars show lower latency but acknowledge the operational cost of maintaining the index.",
      },
    ],
  },
  {
    id: "parallel",
    name: "Parallel Workers",
    trigger: "Fan out work",
    summary: "Independent chunks run concurrently, improving throughput until contention appears.",
    stages: ["Queue", "Shard", "Workers", "Merge", "Response"],
    bars: [68, 62, 88],
    metrics: [
      { label: "Throughput", value: "3x" },
      { label: "Bottleneck", value: "Merge" },
      { label: "Risk", value: "Race/lock" },
    ],
    insightSteps: [
      {
        title: "Work enters a queue",
        description: "The request becomes a unit of work that can be split instead of processed serially.",
      },
      {
        title: "Shards divide the input",
        description: "Independent chunks make parallel execution possible.",
      },
      {
        title: "Workers run concurrently",
        description: "Multiple workers increase throughput until coordination or resource contention appears.",
      },
      {
        title: "Merge becomes the bottleneck",
        description: "Fan-out still needs a safe join point, which can become the new limiting resource.",
      },
      {
        title: "Response reflects throughput gains",
        description: "The final stage shows higher throughput with coordination risk shifted to the merge boundary.",
      },
    ],
  },
  {
    id: "cache",
    name: "Cache Fast Path",
    trigger: "Warm cache",
    summary: "Hot data exits through Redis/cache before touching slower persistence layers.",
    stages: ["Input", "Key hash", "Cache hit", "Serialize", "Response"],
    bars: [22, 31, 92],
    metrics: [
      { label: "Latency", value: "18ms" },
      { label: "Hit rate", value: "92%" },
      { label: "Tradeoff", value: "Invalidation" },
    ],
    insightSteps: [
      {
        title: "Input is converted to a cache key",
        description: "The request starts by shaping data into a stable lookup key.",
      },
      {
        title: "Key hash targets hot data",
        description: "The cache path avoids expensive persistence when the key is already warm.",
      },
      {
        title: "Cache hit exits early",
        description: "The fast path responds before reaching slower database or compute stages.",
      },
      {
        title: "Serialization shapes the payload",
        description: "The hot value is converted into the response format without touching slower persistence.",
      },
      {
        title: "Response returns on the fast path",
        description: "The result is very fast, with invalidation and freshness as the main tradeoffs.",
      },
    ],
  },
] as const satisfies readonly PerformanceProfile[];

export const labInsight = {
  animation: "The bench advances through the active request path and updates latency, memory, and throughput bars so each optimization strategy can be compared against the same pipeline shape.",
  knowledge: "This demonstrates that performance work is tradeoff analysis across algorithms, indexing, parallelism, caching, memory pressure, and operational complexity rather than one generic speedup trick.",
  steps: [
    {
      title: "Input reaches the selected path",
      description: "The first stage establishes the work entering the baseline, index, worker, or cache strategy.",
    },
    {
      title: "The main cost center activates",
      description: "Planner, loop, sharding, or key hashing shows where the strategy spends coordination effort.",
    },
    {
      title: "Data access strategy changes cost",
      description: "Index, scan, cache, or worker execution shifts the balance between latency and resources.",
    },
    {
      title: "Response exposes the tradeoff",
      description: "The final stage and bars show whether latency, memory, or throughput improved or regressed.",
    },
  ],
  concepts: [
    {
      title: "Optimization tradeoffs",
      description: "Performance improvements usually move cost between latency, memory, throughput, and complexity.",
      bullets: [
        "Indexes reduce read cost but increase write and storage overhead.",
        "Parallel workers improve throughput until merge, contention, or coordination dominates.",
        "Caches create fast paths but introduce invalidation and consistency concerns.",
      ],
    },
    {
      title: "Measuring the right bottleneck",
      description: "A performance fix is only meaningful when it targets the actual limiting resource.",
      bullets: [
        "Latency cost, memory pressure, and throughput are intentionally shown separately.",
        "A strategy can improve one metric while worsening another.",
        "The best optimization depends on workload shape, data locality, and operational constraints.",
      ],
    },
  ],
} satisfies LabInsight;
