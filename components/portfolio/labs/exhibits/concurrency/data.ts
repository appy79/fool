import type { LabInsight, LabScenarioBase } from "../../types";

export type ConcurrencyMode = LabScenarioBase & {
  workers: number;
  observedIncrement: number;
  phases: readonly string[];
};

export const concurrencyModes = [
  {
    id: "race",
    name: "Race Condition",
    trigger: "Race increments",
    summary: "Four threads read the same shared value and overwrite each other, losing increments.",
    workers: 4,
    observedIncrement: 1,
    phases: ["Ready", "Read same value", "Compute +1", "Write collisions"],
    metrics: [
      { label: "Correctness", value: "Lost updates" },
      { label: "Throughput", value: "High but wrong" },
      { label: "Primitive", value: "None" },
    ],
    insightSteps: [
      {
        title: "Workers start without coordination",
        description: "All four threads are schedulable and no primitive protects the shared counter.",
      },
      {
        title: "Every thread reads the same stale value",
        description: "The animation shows each worker copying the same counter value into local state.",
      },
      {
        title: "Each worker computes +1 locally",
        description: "The local calculations are individually correct but based on the same old snapshot.",
      },
      {
        title: "Writes collide and updates are lost",
        description: "All workers write the same result, so throughput looks high while correctness fails.",
      },
    ],
  },
  {
    id: "mutex",
    name: "Mutex Lock",
    trigger: "Lock counter",
    summary: "Threads serialize access through a mutex so the counter is correct, but contention appears.",
    workers: 4,
    observedIncrement: 4,
    phases: ["Ready", "Acquire lock", "Increment safely", "Release lock"],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Throughput", value: "Lower" },
      { label: "Primitive", value: "Mutex" },
    ],
    insightSteps: [
      {
        title: "Threads queue for one critical section",
        description: "The lock marker shows that shared counter access must pass through a single owner.",
      },
      {
        title: "T1 acquires the mutex",
        description: "One worker enters while the others wait their turn instead of reading stale state.",
      },
      {
        title: "The protected write commits safely",
        description: "The counter update happens inside the critical section, preserving exact increments.",
      },
      {
        title: "The lock releases for the next worker",
        description: "Correctness is restored, with visible serialization as the performance tradeoff.",
      },
    ],
  },
  {
    id: "atomic",
    name: "Atomic Increment",
    trigger: "Use atomic op",
    summary: "The increment becomes a single indivisible operation, preserving correctness with less lock overhead.",
    workers: 4,
    observedIncrement: 4,
    phases: ["Ready", "CPU atomic", "Cache sync", "Commit value"],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Throughput", value: "High" },
      { label: "Primitive", value: "CAS/atomic" },
    ],
    insightSteps: [
      {
        title: "Workers target an atomic instruction",
        description: "The CPU marker replaces a broad critical section with a single indivisible update.",
      },
      {
        title: "CAS owns the read-modify-write",
        description: "The counter read and write are treated as one operation from the thread's perspective.",
      },
      {
        title: "Cache synchronization resolves contention",
        description: "The sync bus shows hardware-level coordination keeping cores from committing stale writes.",
      },
      {
        title: "The counter commits exactly",
        description: "All increments land without the larger lock overhead of a user-space critical section.",
      },
    ],
  },
  {
    id: "semaphore",
    name: "Semaphore",
    trigger: "Limit workers",
    summary: "A semaphore allows a bounded number of workers through the critical region at once.",
    workers: 4,
    observedIncrement: 4,
    phases: ["Ready", "Acquire permit", "Bounded work", "Return permit"],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Parallelism", value: "Bounded" },
      { label: "Primitive", value: "Semaphore" },
    ],
    insightSteps: [
      {
        title: "Workers wait for permits",
        description: "The semaphore starts with a small number of available permits instead of a single lock owner.",
      },
      {
        title: "Two workers acquire permits",
        description: "T1 and T2 enter together while the remaining workers wait outside the bound.",
      },
      {
        title: "Bounded work proceeds safely",
        description: "The critical region allows controlled parallelism without unbounded shared-state pressure.",
      },
      {
        title: "Permits return to the pool",
        description: "The final phase makes the concurrency limit explicit rather than treating access as all-or-nothing.",
      },
    ],
  },
  {
    id: "queue",
    name: "Work Queue",
    trigger: "Queue tasks",
    summary: "Workers avoid shared counter races by sending increments through a queue-owned reducer.",
    workers: 4,
    observedIncrement: 4,
    phases: ["Ready", "Enqueue deltas", "Reducer drains", "Single writer"],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Backpressure", value: "Visible" },
      { label: "Primitive", value: "Queue" },
    ],
    insightSteps: [
      {
        title: "Workers produce deltas",
        description: "Threads avoid direct counter writes and produce small +1 messages instead.",
      },
      {
        title: "Deltas enter the work queue",
        description: "The queue absorbs concurrent producers and makes backlog visible.",
      },
      {
        title: "Reducer drains one item at a time",
        description: "A single owner applies updates, eliminating shared counter races.",
      },
      {
        title: "Single writer commits the result",
        description: "Correctness comes from ownership transfer and backpressure rather than locks around every worker.",
      },
    ],
  },
  {
    id: "deadlock",
    name: "Deadlock",
    trigger: "Create deadlock",
    summary: "Two threads hold different locks and wait forever for the other lock to be released.",
    workers: 2,
    observedIncrement: 0,
    phases: ["Thread A locks X", "Thread B locks Y", "A waits for Y", "B waits for X"],
    metrics: [
      { label: "Correctness", value: "No progress" },
      { label: "Throughput", value: "0" },
      { label: "Risk", value: "Circular wait" },
    ],
    insightSteps: [
      {
        title: "Thread A locks resource X",
        description: "The first worker owns one lock and still needs another resource to finish.",
      },
      {
        title: "Thread B locks resource Y",
        description: "The second worker owns the other lock, creating the ingredients for circular wait.",
      },
      {
        title: "A waits for Y",
        description: "A cannot proceed because B holds the resource it needs.",
      },
      {
        title: "B waits for X",
        description: "Both workers now wait forever, so the counter makes no progress.",
      },
    ],
  },
  {
    id: "multiprocessing",
    name: "Multiprocessing",
    trigger: "Fork workers",
    summary: "Separate processes avoid the GIL for CPU-bound work, then merge results through IPC.",
    workers: 4,
    observedIncrement: 4,
    phases: ["Fork workers", "Private memory", "Parallel compute", "Merge result"],
    metrics: [
      { label: "CPU use", value: "Multi-core" },
      { label: "Memory", value: "Isolated" },
      { label: "Overhead", value: "IPC" },
    ],
    insightSteps: [
      {
        title: "The parent forks workers",
        description: "The workers become separate processes rather than threads sharing one memory space.",
      },
      {
        title: "Each process owns private memory",
        description: "The private-memory panel shows why direct shared counter races disappear.",
      },
      {
        title: "Processes compute in parallel",
        description: "CPU-bound work can use multiple cores because each process runs independently.",
      },
      {
        title: "IPC merges the results",
        description: "The merge step reintroduces coordination cost, but at a controlled boundary.",
      },
    ],
  },
] as const satisfies readonly ConcurrencyMode[];

export const labInsight = {
  animation: "The scheduler phases show workers reading, computing, waiting, committing, or deadlocking around a shared counter. The expected and observed counters reveal whether the selected primitive preserves correctness.",
  knowledge: "This demonstrates understanding of races, critical sections, atomics, semaphores, queues, deadlocks, process isolation, and the correctness costs hidden inside concurrent performance work.",
  steps: [
    {
      title: "Workers become schedulable",
      description: "Threads or processes are ready to act on a shared counter, private memory, or queue.",
    },
    {
      title: "Access rule is applied",
      description: "The selected primitive controls whether workers read freely, acquire locks, enqueue work, or wait.",
    },
    {
      title: "Local work or contention appears",
      description: "The animation shows stale reads, serialized access, atomic execution, reducer ownership, or circular wait.",
    },
    {
      title: "Final state proves correctness",
      description: "Expected and observed counters reveal exact updates, lost updates, or no progress.",
    },
  ],
  concepts: [
    {
      title: "Shared state correctness",
      description: "Concurrent workers can interleave reads and writes in ways that make simple code incorrect.",
      bullets: [
        "Race conditions happen when multiple workers read stale state and overwrite each other.",
        "Mutexes and semaphores serialize or bound access to critical regions.",
        "Atomic operations make a small update indivisible without a full lock around user code.",
      ],
    },
    {
      title: "Coordination alternatives",
      description: "Not every concurrency problem should be solved with the same primitive.",
      bullets: [
        "Queues move ownership to a single reducer and make backpressure visible.",
        "Deadlocks show why lock ordering and timeout strategies matter.",
        "Multiprocessing avoids shared memory races by isolating state and merging results through IPC.",
      ],
    },
  ],
} satisfies LabInsight;
