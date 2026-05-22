import type { MachinePreset } from "../../types";

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
    explanation:
      "The simplest possible destructive pass over memory. It is useful for talking about tape as memory and mutation cost.",
    complexityNote: "O(n) time, one write per symbol, and no need for additional working states.",
  },
] satisfies MachinePreset[];
