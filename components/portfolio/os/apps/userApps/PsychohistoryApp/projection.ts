import { OPENERS, OUTCOMES } from "./data";

export type Projection = {
  id: number;
  seed: string;
  opener: string;
  outcome: string;
  confidence: number;
  horizon: number;
};

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic "forecast": same seed always yields the same projection. */
export function project(seedRaw: string, id: number): Projection {
  const seed = seedRaw.trim() || "the unknown";
  const h = hash(seed.toLowerCase());
  return {
    id,
    seed,
    opener: OPENERS[h % OPENERS.length],
    outcome: OUTCOMES[(h >> 3) % OUTCOMES.length].replace("{s}", seed),
    confidence: 60 + ((h >> 5) % 39),
    horizon: 1 + ((h >> 7) % 6),
  };
}
