import { OPENERS, OUTCOMES } from "./data";

export type Projection = {
  id: number;
  seed: string;
  opener: string;
  outcome: string;
  confidence: number;
  horizon: number;
};

/** Fisher-Yates: returns the indices [0..length) in a random order (the draw queue). */
export function shuffledQueue(length: number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

/** Builds one projection from a specific (already-dequeued) outcome line. */
export function buildProjection(seedRaw: string, outcomeIndex: number, id: number): Projection {
  const seed = seedRaw.trim() || "the unknown";
  return {
    id,
    seed,
    opener: pick(OPENERS),
    outcome: capitalize(OUTCOMES[outcomeIndex].replace(/\{s\}/g, seed)),
    confidence: 61 + Math.floor(Math.random() * 38),
    horizon: 1 + Math.floor(Math.random() * 6),
  };
}
