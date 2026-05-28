import type { LabInsight, LabScenarioBase } from "../../types";

type ConcurrencyMode = LabScenarioBase & {
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
    phases: [
      "Ready", 
      "T1 Lock & Write", 
      "T2 Lock & Write", 
      "T3 Lock & Write", 
      "T4 Lock & Write", 
      "All Committed"
    ],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Throughput", value: "Lower" },
      { label: "Primitive", value: "Mutex" },
    ],
    insightSteps: [
      {
        title: "Threads queue for lock",
        description: "All threads attempt to enter the critical section, but the mutex enforces mutual exclusion.",
      },
      {
        title: "T1 acquires and commits",
        description: "T1 obtains the lock first, increments the shared register safely to 1, and releases the lock.",
      },
      {
        title: "T2 takes its turn",
        description: "T2 enters the critical section next, reads the fresh value of 1, increments to 2, and releases the lock.",
      },
      {
        title: "T3 takes its turn",
        description: "T3 gets the lock, reads the value 2, increments the register to 3, preserving perfect serialization.",
      },
      {
        title: "T4 completes sequence",
        description: "T4 runs the final safe update to 4. Zero updates are lost, though serialization was required.",
      },
      {
        title: "All threads committed",
        description: "Correctness is restored, with visible serialization as the performance tradeoff.",
      },
    ],
  },
  {
    id: "atomic",
    name: "Atomic Increment",
    trigger: "Use atomic op",
    summary: "The counter update becomes one linearizable hardware operation, preserving correctness without a broad mutex.",
    workers: 4,
    observedIncrement: 4,
    phases: [
      "Ready", 
      "T1 Atomic Sync", 
      "T2 Atomic Sync", 
      "T3 Atomic Sync", 
      "T4 Atomic Sync", 
      "All Committed"
    ],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Throughput", value: "High" },
      { label: "Primitive", value: "fetch_add/CAS" },
    ],
    insightSteps: [
      {
        title: "Workers target register",
        description: "The CPU atomic instruction allows safe, concurrent updates without a broad critical section.",
      },
      {
        title: "T1 atomic operation",
        description: "T1 executes a linearizable atomic increment, successfully moving the register to 1.",
      },
      {
        title: "T2 atomic operation",
        description: "T2's atomic increment is ordered after T1 at the memory location, moving the register to 2.",
      },
      {
        title: "T3 atomic operation",
        description: "T3 commits its atomic increment to 3 safely without holding any high-level mutex.",
      },
      {
        title: "T4 atomic operation",
        description: "T4 executes the final atomic update to write 4. The cache-coherence protocol serializes the memory location.",
      },
      {
        title: "All increments completed",
        description: "All increments land without the larger lock overhead of a user-space critical section.",
      },
    ],
  },
  {
    id: "semaphore",
    name: "Semaphore",
    trigger: "Limit workers",
    summary: "A semaphore bounds how many workers may use a limited resource at once; it is not a mutex for one shared variable.",
    workers: 4,
    observedIncrement: 4,
    phases: [
      "Ready", 
      "T1/T2 Use Permits", 
      "T1/T2 Release", 
      "T3/T4 Use Permits", 
      "T3/T4 Release", 
      "All Committed"
    ],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Parallelism", value: "Bounded" },
      { label: "Primitive", value: "Semaphore" },
    ],
    insightSteps: [
      {
        title: "Queueing for permits",
        description: "The semaphore is initialized with 2 permits, so up to 2 workers can use the bounded resource.",
      },
      {
        title: "T1 and T2 use permits",
        description: "T1 and T2 check out the two available permits and run concurrently, while T3/T4 wait.",
      },
      {
        title: "T1 and T2 release",
        description: "T1 and T2 finish their bounded-resource work, record completion, and return permits to the pool.",
      },
      {
        title: "T3 and T4 use permits",
        description: "T3 and T4 acquire the released permits and begin their concurrent execution.",
      },
      {
        title: "T3 and T4 release",
        description: "T3 and T4 complete their bounded-resource work and record the final completions.",
      },
      {
        title: "Permits fully released",
        description: "All threads have run. Parallelism was bounded at exactly 2 resource users, but shared data still needs its own protection.",
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
    phases: [
      "Ready", 
      "Enqueue Messages", 
      "Drain T1 & T2", 
      "Drain T3 & T4", 
      "All Completed"
    ],
    metrics: [
      { label: "Correctness", value: "Exact" },
      { label: "Backpressure", value: "Visible" },
      { label: "Primitive", value: "Queue" },
    ],
    insightSteps: [
      {
        title: "Workers submit tasks",
        description: "Threads produce +1 increment messages and push them into the thread-safe work queue.",
      },
      {
        title: "Deltas buffered in queue",
        description: "The queue holds the concurrent messages, absorbing load spikes and acting as a buffer.",
      },
      {
        title: "Single-threaded drain 1",
        description: "A dedicated single-threaded reducer drains and processes the first two messages, updating the register to 2.",
      },
      {
        title: "Single-threaded drain 2",
        description: "The reducer processes the remaining two messages to write 4, avoiding lock contention entirely.",
      },
      {
        title: "All tasks drained",
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
    phases: [
      "Ready",
      "Thread A locks X", 
      "Thread B locks Y", 
      "A waits for Y", 
      "B waits for X"
    ],
    metrics: [
      { label: "Correctness", value: "No progress" },
      { label: "Throughput", value: "0" },
      { label: "Risk", value: "Circular wait" },
    ],
    insightSteps: [
      {
        title: "Both workers are ready",
        description: "Both Thread A and Thread B are ready. No locks are currently held.",
      },
      {
        title: "Thread A locks resource X",
        description: "The first worker owns lock X and still needs resource Y to finish.",
      },
      {
        title: "Thread B locks resource Y",
        description: "The second worker owns lock Y, creating the ingredients for circular wait.",
      },
      {
        title: "A waits for Y",
        description: "A attempts to acquire Y but cannot proceed because B holds Y.",
      },
      {
        title: "B waits for X",
        description: "B attempts to acquire X. Both workers now wait forever in a circular dependency.",
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
    phases: [
      "Ready",
      "Fork workers", 
      "Private memory", 
      "Parallel compute", 
      "Merge result"
    ],
    metrics: [
      { label: "CPU use", value: "Multi-core" },
      { label: "Memory", value: "Isolated" },
      { label: "Overhead", value: "IPC" },
    ],
    insightSteps: [
      {
        title: "Parent process is ready",
        description: "The main parent process is prepared to partition concurrent computation.",
      },
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
