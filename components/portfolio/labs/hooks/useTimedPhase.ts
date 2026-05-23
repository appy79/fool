"use client";

import { useEffect, useRef, useState } from "react";

type UseTimedPhaseOptions = {
  phaseCount: number;
  intervalMs: number;
  onAdvance?: (currentPhase: number, nextPhase: number) => void;
  onAdvanceToFinal?: (currentPhase: number, nextPhase: number) => void;
  onComplete?: () => void;
  stopOnAdvanceToFinal?: boolean;
};

export default function useTimedPhase({
  phaseCount,
  intervalMs,
  onAdvance,
  onAdvanceToFinal,
  onComplete,
  stopOnAdvanceToFinal = false,
}: UseTimedPhaseOptions) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const onAdvanceRef = useRef(onAdvance);
  const onAdvanceToFinalRef = useRef(onAdvanceToFinal);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
    onAdvanceToFinalRef.current = onAdvanceToFinal;
    onCompleteRef.current = onComplete;
  }, [onAdvance, onAdvanceToFinal, onComplete]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setPhaseIndex((current) => {
        const finalPhase = Math.max(phaseCount - 1, 0);

        if (current >= finalPhase) {
          setIsRunning(false);
          onCompleteRef.current?.();
          return current;
        }

        const next = current + 1;
        onAdvanceRef.current?.(current, next);

        if (next >= finalPhase) {
          onAdvanceToFinalRef.current?.(current, next);

          if (stopOnAdvanceToFinal) {
            setIsRunning(false);
          }
        }

        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, isRunning, phaseCount, stopOnAdvanceToFinal]);

  const start = () => {
    setPhaseIndex(0);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setPhaseIndex(0);
    setIsRunning(false);
  };

  const selectPhase = (nextPhase: number) => {
    setPhaseIndex(Math.max(0, Math.min(nextPhase, Math.max(phaseCount - 1, 0))));
    setIsRunning(false);
  };

  return {
    isRunning,
    phaseIndex,
    reset,
    selectPhase,
    setPhaseIndex,
    start,
    stop,
  };
}
