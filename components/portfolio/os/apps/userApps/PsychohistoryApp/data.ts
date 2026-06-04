export const copy = {
  eyebrow: "psychohistory // projection",
  title: "Forecast engine",
  intro:
    "A playful Foundation-style oracle. Feed it a variable and it draws a fresh projection from the vault — no line repeats until the whole vault is spent. Strictly for fun.",
  placeholder: "a variable to project…",
  submitLabel: "Project",
};

export const DEFAULT_SEED = "this portfolio";

/**
 * The projection vault. Each line is one "future" and is served at most once per
 * cycle (a shuffled queue is drained before any line repeats). `{s}` is replaced by
 * the seed the visitor projects. Keep the first word capitalization-friendly — the
 * renderer capitalizes the first character after substitution.
 */
export const OUTCOMES = [
  "{s} converges toward a stable attractor after a brief period of turbulence.",
  "a minor crisis around {s} resolves on its own — intervention is unnecessary.",
  "{s} bifurcates; prepare a contingency vault before the third cycle.",
  "the Mule-risk for {s} stays low, but watch the second-order effects.",
  "{s} compounds quietly now, then matters enormously a few cycles out.",
  "{s} is a red herring; the decisive variable lies adjacent to it.",
  "{s} reaches equilibrium only after one well-timed nudge.",
  "{s} triggers a Seldon Crisis exactly when the actors believe they have free choice.",
  "the Encyclopedia will record {s} as inevitable — it was anything but.",
  "{s} drifts off-Plan by 0.4%, comfortably within tolerance. Do nothing.",
  "Trantor's archives suggest {s} has happened before, under a different name.",
  "{s} fails first, then succeeds spectacularly on the second iteration.",
  "the probability cloud around {s} is unusually tight — suspiciously so.",
  "{s} is load-bearing; remove it and three other forecasts collapse.",
  "{s} resolves the moment everyone stops watching it.",
  "the Second Foundation has already adjusted for {s}. You're welcome.",
  "{s} looks chaotic up close and perfectly ordered from a thousand years away.",
  "{s} will be misattributed to luck for at least a generation.",
  "a single unmodeled individual could overturn {s}. Statistically, they won't.",
  "{s} stabilizes, but only after burning through its margin of error.",
  "{s} is the kind of variable historians will argue about for centuries.",
  "the equations rate {s} as 'amusing, but ultimately decisive.'",
  "{s} produces a false plateau; the real inflection arrives later than expected.",
  "{s} is entangled with morale — fix the mood and the metric follows.",
  "{s} survives contact with reality, which is more than most plans manage.",
  "the projection for {s} is robust to everything except hubris.",
  "{s} oscillates twice, overshoots once, then settles into the Plan.",
  "{s} is best left alone; every intervention so far has made it worse.",
  "the model gives {s} a one-in-seven chance of becoming legendary.",
  "{s} quietly reroutes the future through a channel no one mapped.",
  "{s} is fine. It's the thing standing next to {s} that needs a vault.",
  "{s} will feel like failure right up until it abruptly doesn't.",
  "the Radiant shows {s} branching, then re-converging — patience is the strategy.",
  "{s} accumulates small advantages until the lead becomes unassailable.",
  "{s} is a stress test wearing the costume of an opportunity.",
  "history will compress {s} into a single sentence. Make it a good one.",
  "{s} depends on a decision you haven't yet realized you're about to make.",
  "{s} is psychohistorically boring, which is the highest possible compliment.",
  "{s} requires no heroics — only consistency across the next few cycles.",
  "the variance on {s} collapses the instant the first domino is allowed to fall.",
  "{s} is the lever; the fulcrum sits somewhere in the previous decade.",
  "{s} will be copied widely and understood narrowly.",
  "the equations flag {s} with a single instruction: do not optimize prematurely.",
  "{s} ends one era cleanly enough that the next one barely notices.",
  "{s} is statistically unremarkable and historically pivotal, both at once.",
  "{s} resolves in your favor the moment you simply outlast the noise.",
  "the Plan assigns {s} to the slow, certain path over the fast, fragile one.",
  "{s} is a seed crystal; structure forms around it whether you intend it or not.",
  "{s} will look obvious in hindsight and impossible in advance.",
  "{s} converges — but the interesting story was always the path, never the endpoint.",
  "{s} is the variable the next generation names a theorem after.",
  "{s} hums along under threshold until precisely the wrong observer notices.",
];

export const OPENERS = [
  "The Plan holds.",
  "Seldon's equations resolve:",
  "Across the projected horizon:",
  "With non-negligible probability:",
  "Psychohistorical drift indicates:",
  "The Prime Radiant resolves:",
  "Per the Second Foundation's models:",
  "Extrapolating from Trantor:",
  "The vault opens.",
  "Holding all else constant:",
  "In the aggregate of trillions:",
  "The crisis math is clear:",
  "Folding in the latest data:",
  "Read against the long arc:",
  "Beneath the statistical fog:",
  "If the Plan is to be trusted:",
];

export const SUGGESTIONS = [
  "this portfolio",
  "distributed systems",
  "the next deploy",
  "my career",
  "the Foundation",
];

/** Revealed only after every line in the vault has been drawn. */
export const EASTER_EGG = {
  badge: "vault // sealed record",
  opener: "The Prime Radiant goes dark, then resolves one final time.",
  lines: [
    "You have drawn every projection in the vault.",
    "Seldon left one recording, time-locked until the equations ran dry:",
    "“If you are hearing this, you have outlasted the Plan's patience. The decisive variable was never in the data — it was the one reading it. Now go do the single thing psychohistory can never model: surprise me.”",
  ],
  signature: "— H. Seldon · recording ends",
  resetLabel: "Recompute the Plan",
};
