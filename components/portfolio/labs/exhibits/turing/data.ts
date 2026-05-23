import type { MachinePreset, LabInsight } from "../../types";

export const blank = "_";
export const tapeRadius = 8;

export const transitionKey = (state: string, symbol: string) => `${state}:${symbol}`;

export const machinePresets = [
  {
    id: "binary-increment",
    name: "Binary Incrementer",
    goal: "Increment a binary number in-place.",
    initialTape: ["1", "0", "1", "1"],
    initialHead: 0,
    initialState: "scan-right",
    haltStates: ["halt"],
    transitions: {
      [transitionKey("scan-right", "0")]: {
        write: "0",
        move: "R",
        next: "scan-right",
        note: "Move to the least significant bit.",
      },
      [transitionKey("scan-right", "1")]: {
        write: "1",
        move: "R",
        next: "scan-right",
        note: "Keep scanning right.",
      },
      [transitionKey("scan-right", blank)]: {
        write: blank,
        move: "L",
        next: "carry",
        note: "Blank found. Step left and start carry propagation.",
      },
      [transitionKey("carry", "1")]: {
        write: "0",
        move: "L",
        next: "carry",
        note: "1 + carry becomes 0, carry continues left.",
      },
      [transitionKey("carry", "0")]: {
        write: "1",
        move: "S",
        next: "halt",
        note: "0 + carry becomes 1, computation halts.",
      },
      [transitionKey("carry", blank)]: {
        write: "1",
        move: "S",
        next: "halt",
        note: "Overflow creates a new leading 1.",
      },
    },
    metrics: [
      { label: "Machine type", value: "Transducer" },
      { label: "State focus", value: "Carry" },
      { label: "Cost model", value: "O(n)" },
    ],
    insightSteps: [
      {
        title: "Read the first input bit",
        description: "The head starts on the most significant bit and scans right without changing the input.",
      },
      {
        title: "Keep scanning toward the end",
        description: "The machine stays in scan-right while crossing the middle bits of the binary number.",
      },
      {
        title: "Reach the least significant side",
        description: "Another right move brings the head closer to the blank that marks the end of the number.",
      },
      {
        title: "Scan the final input bit",
        description: "The head crosses the last 1 before it can discover the blank boundary.",
      },
      {
        title: "Find blank and enter carry state",
        description: "The blank tells the machine to step left and begin binary carry propagation.",
      },
      {
        title: "Carry flips trailing one to zero",
        description: "A 1 plus carry becomes 0, so the carry continues left.",
      },
      {
        title: "Carry flips the next one to zero",
        description: "The carry still has not resolved, so the next 1 is also rewritten to 0.",
      },
      {
        title: "Carry resolves on zero and halts",
        description: "A 0 plus carry becomes 1, completing the increment and halting the machine.",
      },
    ],
    explanation:
      "This machine shows state, tape mutation, and carry propagation. It is a tiny executable model of a deterministic state machine.",
    complexityNote: "Worst case O(n), when the input is all 1s and carry propagates across the whole tape.",
  },
  {
    id: "even-parity",
    name: "Even Parity Checker",
    goal: "Accept strings with an even number of 1s.",
    initialTape: ["1", "0", "1", "1", "0", "1"],
    initialHead: 0,
    initialState: "even",
    haltStates: ["accept", "reject"],
    acceptStates: ["accept"],
    rejectStates: ["reject"],
    transitions: {
      [transitionKey("even", "0")]: {
        write: "0",
        move: "R",
        next: "even",
        note: "0 does not change parity.",
      },
      [transitionKey("even", "1")]: {
        write: "1",
        move: "R",
        next: "odd",
        note: "A 1 toggles parity to odd.",
      },
      [transitionKey("even", blank)]: {
        write: blank,
        move: "S",
        next: "accept",
        note: "Input ended in even parity.",
      },
      [transitionKey("odd", "0")]: {
        write: "0",
        move: "R",
        next: "odd",
        note: "0 preserves odd parity.",
      },
      [transitionKey("odd", "1")]: {
        write: "1",
        move: "R",
        next: "even",
        note: "A 1 toggles parity back to even.",
      },
      [transitionKey("odd", blank)]: {
        write: blank,
        move: "S",
        next: "reject",
        note: "Input ended in odd parity.",
      },
    },
    metrics: [
      { label: "Machine type", value: "Recognizer" },
      { label: "State focus", value: "Parity" },
      { label: "Tape writes", value: "None" },
    ],
    insightSteps: [
      {
        title: "Read first 1 and toggle odd",
        description: "The machine sees a 1, moves right, and changes from even to odd parity.",
      },
      {
        title: "Read 0 and preserve odd",
        description: "A 0 does not change parity, so the machine remains odd and advances.",
      },
      {
        title: "Read 1 and toggle even",
        description: "The second 1 returns the parity state to even.",
      },
      {
        title: "Read 1 and toggle odd again",
        description: "Another 1 flips the finite control back to odd.",
      },
      {
        title: "Read 0 and preserve odd",
        description: "The 0 is copied through and parity remains odd.",
      },
      {
        title: "Read final 1 and toggle even",
        description: "The final 1 makes the total number of ones even.",
      },
      {
        title: "Read blank and accept",
        description: "The input ends in the even state, so the machine accepts.",
      },
    ],
    explanation:
      "This is a finite automaton expressed on a Turing tape. It demonstrates state minimization and acceptance/rejection behavior.",
    complexityNote: "O(n) time and O(1) state memory. The tape is read once from left to right.",
  },
  {
    id: "unary-eraser",
    name: "Unary Eraser",
    goal: "Erase a unary input until only blanks remain.",
    initialTape: ["1", "1", "1", "1", "1"],
    initialHead: 0,
    initialState: "erase",
    haltStates: ["halt"],
    transitions: {
      [transitionKey("erase", "1")]: {
        write: blank,
        move: "R",
        next: "erase",
        note: "Erase the current mark and continue.",
      },
      [transitionKey("erase", blank)]: {
        write: blank,
        move: "S",
        next: "halt",
        note: "No marks remain to the right.",
      },
    },
    metrics: [
      { label: "Machine type", value: "Mutator" },
      { label: "State focus", value: "Erase pass" },
      { label: "Writes", value: "One per mark" },
    ],
    insightSteps: [
      {
        title: "Erase the first mark",
        description: "The head replaces the first unary mark with blank and moves right.",
      },
      {
        title: "Erase the second mark",
        description: "The destructive pass continues one cell at a time.",
      },
      {
        title: "Erase the third mark",
        description: "Each transition performs one write and one right move.",
      },
      {
        title: "Erase the fourth mark",
        description: "The tape keeps shifting under the fixed head as marks are removed.",
      },
      {
        title: "Erase the fifth mark",
        description: "The final input mark is cleared before the machine sees blank memory.",
      },
      {
        title: "Read blank and halt",
        description: "A blank means no marks remain to the right, so the machine halts.",
      },
    ],
    explanation:
      "The simplest possible destructive pass over memory. It is useful for talking about tape as memory and mutation cost.",
    complexityNote: "O(n) time, one write per symbol, and no need for additional working states.",
  },
] satisfies readonly MachinePreset[];

export const labInsight = {
  animation: "The tape, head, state, and transition table show computation as explicit memory reads, writes, movement, and state changes. Stepping makes each transition visible before the machine halts or rejects.",
  knowledge: "This demonstrates grounding in computation fundamentals: state machines, tape memory, deterministic transitions, halting behavior, and the cost model behind simple algorithms.",
  steps: [
    {
      title: "Read the active tape cell",
      description: "The head is aligned over one cell, and the current state plus symbol selects a transition.",
    },
    {
      title: "Apply the transition rule",
      description: "The machine writes a symbol, chooses the next state, and decides whether to move left, right, or stay.",
    },
    {
      title: "Shift tape under the head",
      description: "The visible tape moves so the next memory cell becomes active for the following step.",
    },
    {
      title: "Halt, accept, reject, or continue",
      description: "The current state determines whether computation has finished or another transition is required.",
    },
  ],
  concepts: [
    {
      title: "Turing machine state",
      description: "The active state is the machine's finite control. It decides how to interpret the symbol under the head.",
      bullets: [
        "A transition is selected from the pair of current state and current symbol.",
        "Changing state is how the machine remembers progress without needing a large control program.",
        "Accept, reject, and halt states make completion explicit.",
      ],
    },
    {
      title: "Tape as memory",
      description: "The tape models readable and writable memory one cell at a time.",
      bullets: [
        "Each step reads exactly one cell, writes at most one symbol, and moves the head.",
        "The blank symbol represents untouched memory outside the visible input.",
        "Runtime grows with how many cells the head must inspect or mutate.",
      ],
    },
  ],
} satisfies LabInsight;
