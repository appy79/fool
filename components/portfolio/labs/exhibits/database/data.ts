import type { LabInsight, LabScenarioBase } from "../../types";

type DatabaseAccessModule = LabScenarioBase & {
  stages: readonly string[];
  bars: readonly [number, number, number];
  statLabels: readonly [string, string, string];
};

export const databaseAccessModules = [
  {
    id: "baseline",
    name: "Full Table Scan",
    trigger: "Run scan",
    summary: "A direct scan is simple, but query cost grows with table size and storage latency.",
    stages: ["Query Request", "Parser & Planner", "Disk Buffer Read", "Sequential Scan", "Filter Rows", "Rows Returned"],
    bars: [92, 82, 28],
    statLabels: ["Latency cost", "Buffer pressure", "Read throughput"],
    metrics: [
      { label: "Latency", value: "420ms" },
      { label: "Memory", value: "High churn" },
      { label: "Access path", value: "O(n) scan" },
    ],
    insightSteps: [
      {
        title: "Query reaches parser and planner",
        description: "The incoming request is parsed into an abstract syntax tree and prepared for planning.",
      },
      {
        title: "Planner initiates full relation scan",
        description: "Without selective statistics or an index, the planner resorts to a full table scan.",
      },
      {
        title: "Disk pages loaded into buffer pool",
        description: "Every page in the relation must be read from disk or cache buffers, increasing I/O churn.",
      },
      {
        title: "Sequential record scan executes",
        description: "Execution loops sequentially through every single tuple in the table pages.",
      },
      {
        title: "WHERE condition filtering applied",
        description: "Each row is tested against the query filter predicates to select matching data.",
      },
      {
        title: "Matching rows returned to client",
        description: "The result is compiled and returned, completing the slow, baseline disk-heavy loop.",
      },
    ],
  },
  {
    id: "indexed",
    name: "Indexed Query",
    trigger: "Use index",
    summary: "An index trades write/storage cost for faster reads and fewer scanned rows.",
    stages: ["Query Request", "B-tree Index", "Row Pointer Fetch", "Rows Returned"],
    bars: [36, 46, 76],
    statLabels: ["Latency cost", "Index upkeep", "Read throughput"],
    metrics: [
      { label: "Latency", value: "95ms" },
      { label: "Rows read", value: "-88%" },
      { label: "Tradeoff", value: "Write cost" },
    ],
    insightSteps: [
      {
        title: "Query targets indexed search column",
        description: "The database planner detects an index covering the search condition.",
      },
      {
        title: "Traverse B-tree nodes directly to leaf",
        description: "The index is searched via rapid logarithmic leaf lookups, bypassing almost all data pages.",
      },
      {
        title: "Dereference row pointers in heap storage",
        description: "The leaf node provides exact row IDs, loading only the target data tuples.",
      },
      {
        title: "Precise rows returned with low latency",
        description: "The fast-path query completes, saving massive disk reads with low latency.",
      },
    ],
  },
  {
    id: "parallel",
    name: "Parallel Query Workers",
    trigger: "Fan out query",
    summary: "Independent partitions run concurrently, improving throughput until merge or lock contention appears.",
    stages: ["Query Request", "Partition Split", "Parallel Workers", "Merge Results", "Rows Returned"],
    bars: [68, 62, 88],
    statLabels: ["Coordination cost", "Worker pressure", "Read throughput"],
    metrics: [
      { label: "Throughput", value: "3x" },
      { label: "Bottleneck", value: "Merge" },
      { label: "Risk", value: "Lock contention" },
    ],
    insightSteps: [
      {
        title: "Query parsed for parallel execution",
        description: "The database engine identifies that a parallel scan of the relation will be cheaper.",
      },
      {
        title: "Divide relation into table blocks",
        description: "The planner chunks the table into independent block ranges for parallel execution.",
      },
      {
        title: "Multiple background worker threads scan",
        description: "Concurrent CPU cores scan different segments of the data stream simultaneously.",
      },
      {
        title: "Gather and merge worker intermediate sets",
        description: "The coordinator gathers and merges row segments from all workers, creating a bottleneck.",
      },
      {
        title: "Consolidated results returned safely",
        description: "The final merged results are delivered to the client with high throughput.",
      },
    ],
  },
  {
    id: "cache",
    name: "Redis Read-Through Cache",
    trigger: "Warm cache",
    summary: "A miss falls through to the database, then the result is written into Redis so later reads take the fast path.",
    stages: ["Query Request", "Cache Miss", "Database Fetch", "Populate Cache", "Response Returned"],
    bars: [48, 54, 86],
    statLabels: ["First-read latency", "Cache memory", "Repeat-read speed"],
    metrics: [
      { label: "First read", value: "DB fill" },
      { label: "Warm read", value: "18ms" },
      { label: "Tradeoff", value: "Invalidation" },
    ],
    insightSteps: [
      {
        title: "Query converted to hash key",
        description: "The application hashes query parameters into a unique Redis lookup key.",
      },
      {
        title: "Redis lookup misses",
        description: "The key is not in memory yet, so the read-through path must fall through to the primary database.",
      },
      {
        title: "Primary database fetches source row",
        description: "The application loads the authoritative value from the slower persistence layer.",
      },
      {
        title: "Result is written into Redis",
        description: "The fetched payload is cached with a key and TTL so repeat reads can bypass the database.",
      },
      {
        title: "Response returns from warmed path",
        description: "The first request pays the fill cost, while later requests can return from Redis memory.",
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
