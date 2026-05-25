import type { LabInsight, LabScenarioBase } from "../../types";

type DatabaseAccessModule = LabScenarioBase & {
  stages: readonly string[];
  bars: readonly [number, number, number];
};

export const databaseAccessModules = [
  {
    id: "baseline",
    name: "Full Table Scan",
    trigger: "Run scan",
    summary: "A direct scan is simple, but query cost grows with table size and storage latency.",
    stages: ["Query", "Planner", "Buffer churn", "Table scan", "Rows returned"],
    bars: [92, 38, 28],
    metrics: [
      { label: "Latency", value: "420ms" },
      { label: "Memory", value: "High churn" },
      { label: "Access path", value: "O(n) scan" },
    ],
    insightSteps: [
      {
        title: "Query enters the database path",
        description: "The request starts with the simplest access path: inspect available rows until the answer is found.",
      },
      {
        title: "Planner has no selective structure",
        description: "Without a useful index, the planner cannot jump directly to matching rows.",
      },
      {
        title: "Buffer churn appears",
        description: "Repeated page reads and intermediate objects create pressure before the scan completes.",
      },
      {
        title: "Table scan dominates",
        description: "The slow storage access becomes the main bottleneck for this baseline query path.",
      },
      {
        title: "Rows return with baseline latency",
        description: "The result is correct but slow, giving later database modules a measured comparison point.",
      },
    ],
  },
  {
    id: "indexed",
    name: "Indexed Query",
    trigger: "Use index",
    summary: "An index trades write/storage cost for faster reads and fewer scanned rows.",
    stages: ["Query", "Planner", "B-tree index", "Row fetch", "Rows returned"],
    bars: [36, 46, 76],
    metrics: [
      { label: "Latency", value: "95ms" },
      { label: "Rows read", value: "-88%" },
      { label: "Tradeoff", value: "Write cost" },
    ],
    insightSteps: [
      {
        title: "Query reaches the planner",
        description: "The database has enough structure to consider an indexed access path.",
      },
      {
        title: "Planner selects the index",
        description: "The lookup avoids scanning most rows by using precomputed ordering or hash structure.",
      },
      {
        title: "Index narrows the search",
        description: "The B-tree or lookup structure reduces the candidate set before touching table rows.",
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
    name: "Parallel Query Workers",
    trigger: "Fan out query",
    summary: "Independent partitions run concurrently, improving throughput until merge or lock contention appears.",
    stages: ["Queue", "Shard", "Workers", "Merge", "Rows returned"],
    bars: [68, 62, 88],
    metrics: [
      { label: "Throughput", value: "3x" },
      { label: "Bottleneck", value: "Merge" },
      { label: "Risk", value: "Lock contention" },
    ],
    insightSteps: [
      {
        title: "Query becomes parallel work",
        description: "The request is split into chunks instead of being processed as one serial scan.",
      },
      {
        title: "Shards divide the relation",
        description: "Independent partitions make parallel query execution possible.",
      },
      {
        title: "Workers scan concurrently",
        description: "Multiple workers increase throughput until coordination or resource contention appears.",
      },
      {
        title: "Merge becomes the bottleneck",
        description: "Fan-out still needs a safe join point, which can become the new limiting resource.",
      },
      {
        title: "Rows return with throughput gains",
        description: "The final stage shows higher throughput with coordination risk shifted to the merge boundary.",
      },
    ],
  },
  {
    id: "cache",
    name: "Redis Read-Through Cache",
    trigger: "Warm cache",
    summary: "Hot data exits through Redis/cache before touching slower persistence layers.",
    stages: ["Query", "Key hash", "Redis hit", "Serialize", "Response"],
    bars: [22, 31, 92],
    metrics: [
      { label: "Latency", value: "18ms" },
      { label: "Hit rate", value: "92%" },
      { label: "Tradeoff", value: "Invalidation" },
    ],
    insightSteps: [
      {
        title: "Query is converted to a cache key",
        description: "The request starts by shaping query parameters into a stable lookup key.",
      },
      {
        title: "Key hash targets hot data",
        description: "The cache path avoids expensive persistence when the key is already warm.",
      },
      {
        title: "Redis hit exits early",
        description: "The fast path responds before reaching slower database pages or compute stages.",
      },
      {
        title: "Serialization shapes the payload",
        description: "The hot value is converted into the response format without touching slower persistence.",
      },
      {
        title: "Response returns on the fast path",
        description: "The result is very fast, with invalidation and freshness as the main database tradeoffs.",
      },
    ],
  },
] as const satisfies readonly DatabaseAccessModule[];

export const labInsight = {
  steps: [
    {
      title: "Query reaches the selected access path",
      description: "The first stage establishes work entering the scan, index, parallel worker, or cache module.",
    },
    {
      title: "Planner or keying decision activates",
      description: "Planner, sharding, or key hashing shows how the database chooses where to spend coordination effort.",
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
      title: "Database access paths",
      description: "Database performance depends on how queries reach data, not just on faster code around the query.",
      bullets: [
        "Full scans are simple but grow with table size.",
        "Indexes reduce read cost while increasing write and storage overhead.",
        "Caches create fast read paths but require invalidation and consistency discipline.",
      ],
    },
    {
      title: "Measuring the real bottleneck",
      description: "A database fix is only meaningful when it targets the actual limiting resource.",
      bullets: [
        "Latency cost, memory pressure, and throughput are intentionally shown separately.",
        "A strategy can improve one metric while worsening another.",
        "The best access path depends on workload shape, selectivity, data locality, and operational constraints.",
      ],
    },
  ],
} satisfies LabInsight;
