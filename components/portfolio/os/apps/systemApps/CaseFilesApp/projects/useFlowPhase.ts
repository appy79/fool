"use client";

import { useEffect, useState } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const STEP_INTERVAL_MS = 1500;
const FINAL_STEP_INTERVAL_MS = 2500;

/**
 * Drives the looping narration. Advances one step at a time and pauses a little longer on the
 * final "solution" frame. When the user prefers reduced motion we simply pin to the final frame so
 * the fully solved flow is still legible without any movement.
 */
export default function useFlowPhase(stepCount: number) {
  const [phase, setPhase] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (stepCount <= 1) {
      return;
    }

    let cancelled = false;
    let timer = 0;

    if (prefersReducedMotion) {
      // Skip the motion and pin to the fully solved frame so the outcome stays legible.
      timer = window.setTimeout(() => {
        if (!cancelled) {
          setPhase(stepCount - 1);
        }
      }, 0);

      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    let current = 0;

    const schedule = () => {
      const isFinal = current === stepCount - 1;
      timer = window.setTimeout(
        () => {
          if (cancelled) {
            return;
          }
          current = (current + 1) % stepCount;
          setPhase(current);
          schedule();
        },
        isFinal ? FINAL_STEP_INTERVAL_MS : STEP_INTERVAL_MS,
      );
    };

    schedule();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [stepCount, prefersReducedMotion]);

  return phase;
}
