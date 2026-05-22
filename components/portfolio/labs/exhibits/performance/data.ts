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
  },
] as const;
