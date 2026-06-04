import { useCallback, useEffect, useRef, useState } from "react";
import { blank, machinePresets, transitionKey } from "./data";
import type { Direction, MachinePreset, Transition } from "../../types";

function createInitialTape(preset: MachinePreset) {
  const cells = new Map<number, string>();
  preset.initialTape.forEach((symbol, index) => cells.set(index, symbol));

  return cells;
}

function readCell(tape: Map<number, string>, index: number) {
  return tape.get(index) ?? blank;
}

function moveHead(head: number, direction: Direction) {
  if (direction === "L") {
    return head - 1;
  }

  if (direction === "R") {
    return head + 1;
  }

  return head;
}

function reverseMove(direction: Direction): Direction {
  if (direction === "L") {
    return "R";
  }

  if (direction === "R") {
    return "L";
  }

  return "S";
}

function describeTransition(state: string, symbol: string, transition: Transition) {
  return `(${state}, ${symbol}) -> write ${transition.write}, move ${transition.move}, next ${transition.next}. ${transition.note}`;
}

type TuringSnapshot = {
  tape: Map<number, string>;
  head: number;
  state: string;
  steps: number;
  lastTransition: string;
  lastMove: Direction;
  undoMove: Direction;
};

export default function useTuringMachine() {
  const [presetId, setPresetId] = useState(machinePresets[0].id);
  const preset = machinePresets.find((machine) => machine.id === presetId) ?? machinePresets[0];
  const [tape, setTape] = useState(() => createInitialTape(preset));
  const [head, setHead] = useState(preset.initialHead);
  const [state, setState] = useState(preset.initialState);
  const [steps, setSteps] = useState(0);
  const [lastTransition, setLastTransition] = useState("Ready. Press Step or Run.");
  const [isRunning, setIsRunning] = useState(false);
  const [lastMove, setLastMove] = useState<Direction>("S");
  const [clackTick, setClackTick] = useState(0);
  const [history, setHistory] = useState<TuringSnapshot[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<(() => void) | null>(null);

  const isHalted = preset.haltStates.includes(state);
  const stepCount = preset.insightSteps.length;
  const insightStepIndex = Math.min(steps, stepCount - 1);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (nextPreset = preset) => {
      stop();
      setTape(createInitialTape(nextPreset));
      setHead(nextPreset.initialHead);
      setState(nextPreset.initialState);
      setSteps(0);
      setLastTransition("Ready. Press Step or Run.");
      setLastMove("S");
      setClackTick(0);
      setHistory([]);
    },
    [preset, stop],
  );

  const selectPreset = (nextPresetId: string) => {
    const nextPreset =
      machinePresets.find((machine) => machine.id === nextPresetId) ?? machinePresets[0];
    setPresetId(nextPreset.id);
    reset(nextPreset);
  };

  const step = useCallback(() => {
    if (preset.haltStates.includes(state)) {
      stop();
      setLastTransition(`Machine halted in state ${state}.`);
      return;
    }

    const symbol = readCell(tape, head);
    const transition = preset.transitions[transitionKey(state, symbol)];

    if (!transition) {
      setHistory((snapshots) => [
        ...snapshots,
        { tape: new Map(tape), head, state, steps, lastTransition, lastMove, undoMove: "S" },
      ]);
      stop();
      setState("stuck");
      setLastTransition(`No transition for (${state}, ${symbol}). Machine is stuck.`);
      return;
    }

    const nextTape = new Map(tape);
    nextTape.set(head, transition.write);

    setHistory((snapshots) => [
      ...snapshots,
      {
        tape: new Map(tape),
        head,
        state,
        steps,
        lastTransition,
        lastMove,
        undoMove: reverseMove(transition.move),
      },
    ]);
    setTape(nextTape);
    setHead(moveHead(head, transition.move));
    setState(transition.next);
    setSteps((current) => current + 1);
    setLastMove(transition.move);
    setClackTick((current) => current + 1);
    setLastTransition(describeTransition(state, symbol, transition));
  }, [head, lastMove, lastTransition, preset, state, steps, stop, tape]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const run = () => {
    if (isRunning || isHalted) {
      return;
    }

    setIsRunning(true);
    intervalRef.current = setInterval(() => stepRef.current?.(), 650);
  };

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    [],
  );

  const selectStep = (targetStepIndex: number) => {
    if (isRunning) {
      return;
    }

    const targetSteps = Math.max(0, Math.min(targetStepIndex, stepCount));

    if (targetSteps === steps) {
      return;
    }

    if (targetSteps < steps) {
      const previous = history[targetSteps];

      if (!previous) {
        reset();
        return;
      }

      stop();
      setHistory((snapshots) => snapshots.slice(0, targetSteps));
      setTape(new Map(previous.tape));
      setHead(previous.head);
      setState(previous.state);
      setSteps(previous.steps);
      setLastTransition(previous.lastTransition);
      setLastMove(previous.undoMove);
      setClackTick((current) => current + 1);
      return;
    }

    let nextTape = new Map(tape);
    let nextHead = head;
    let nextState = state;
    let nextSteps = steps;
    let nextLastTransition = lastTransition;
    let nextLastMove = lastMove;
    const nextHistory = [...history];

    while (nextSteps < targetSteps && !preset.haltStates.includes(nextState)) {
      const symbol = readCell(nextTape, nextHead);
      const transition = preset.transitions[transitionKey(nextState, symbol)];

      nextHistory.push({
        tape: new Map(nextTape),
        head: nextHead,
        state: nextState,
        steps: nextSteps,
        lastTransition: nextLastTransition,
        lastMove: nextLastMove,
        undoMove: transition ? reverseMove(transition.move) : "S",
      });

      if (!transition) {
        const stuckState = nextState;
        nextState = "stuck";
        nextLastMove = "S";
        nextLastTransition = `No transition for (${stuckState}, ${symbol}). Machine is stuck.`;
        break;
      }

      const writtenTape = new Map(nextTape);
      writtenTape.set(nextHead, transition.write);
      nextLastTransition = describeTransition(nextState, symbol, transition);
      nextLastMove = transition.move;
      nextTape = writtenTape;
      nextHead = moveHead(nextHead, transition.move);
      nextState = transition.next;
      nextSteps += 1;
    }

    setHistory(nextHistory);
    setTape(nextTape);
    setHead(nextHead);
    setState(nextState);
    setSteps(nextSteps);
    setLastTransition(nextLastTransition);
    setLastMove(nextLastMove);
    setClackTick((current) => current + 1);
  };

  return {
    preset,
    tape,
    head,
    state,
    steps,
    lastTransition,
    isRunning,
    lastMove,
    clackTick,
    canRewind: history.length > 0,
    isHalted,
    insightStepIndex,
    run,
    stop,
    reset,
    selectPreset,
    selectStep,
  };
}
