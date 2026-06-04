"use client";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppIcon from "./icon";
import { copy, KEYBOARD_ROWS, WORDS } from "./data";

const LEN = 5;
const TRIES = 6;
type Mark = "correct" | "present" | "absent";

const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function evaluate(guess: string, answer: string): Mark[] {
  const marks: Mark[] = new Array(LEN).fill("absent");
  const counts: Record<string, number> = {};
  for (const ch of answer) counts[ch] = (counts[ch] ?? 0) + 1;
  for (let i = 0; i < LEN; i += 1) {
    if (guess[i] === answer[i]) {
      marks[i] = "correct";
      counts[guess[i]] -= 1;
    }
  }
  for (let i = 0; i < LEN; i += 1) {
    if (marks[i] === "correct") continue;
    if ((counts[guess[i]] ?? 0) > 0) {
      marks[i] = "present";
      counts[guess[i]] -= 1;
    }
  }
  return marks;
}

const RANK: Record<Mark, number> = { absent: 1, present: 2, correct: 3 };

function markStyle(mark: Mark | undefined, filled: boolean): CSSProperties | undefined {
  if (mark === "correct")
    return {
      background: "var(--primary)",
      color: "var(--background)",
      borderColor: "var(--primary)",
    };
  if (mark === "present")
    return { background: "var(--gold)", color: "var(--background)", borderColor: "var(--gold)" };
  if (mark === "absent")
    return {
      background: "color-mix(in oklch, var(--muted) 55%, transparent)",
      color: "var(--muted-foreground)",
      borderColor: "transparent",
    };
  if (filled) return { borderColor: "color-mix(in oklch, var(--primary) 55%, transparent)" };
  return undefined;
}

export default function CipherApp() {
  const [answer, setAnswer] = useState<string>(pickWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shake, setShake] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boardRef.current?.focus({ preventScroll: true });
  }, []);

  const evaluations = useMemo(() => guesses.map((g) => evaluate(g, answer)), [guesses, answer]);

  const keyState = useMemo(() => {
    const map: Record<string, Mark> = {};
    guesses.forEach((g, gi) => {
      evaluations[gi].forEach((mark, i) => {
        const ch = g[i];
        if (!map[ch] || RANK[mark] > RANK[map[ch]]) map[ch] = mark;
      });
    });
    return map;
  }, [guesses, evaluations]);

  const submit = () => {
    if (status !== "playing") return;
    if (current.length !== LEN) {
      setShake(true);
      window.setTimeout(() => setShake(false), 360);
      return;
    }
    const guess = current.toUpperCase();
    const next = [...guesses, guess];
    setGuesses(next);
    setCurrent("");
    if (guess === answer) setStatus("won");
    else if (next.length >= TRIES) setStatus("lost");
  };

  const type = (ch: string) => {
    if (status !== "playing") return;
    setCurrent((c) => (c.length < LEN ? c + ch : c));
  };
  const backspace = () => setCurrent((c) => c.slice(0, -1));

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      backspace();
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      type(event.key.toUpperCase());
    }
  };

  const reset = () => {
    setAnswer(pickWord());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    boardRef.current?.focus({ preventScroll: true });
  };

  const rows = Array.from({ length: TRIES }, (_, r) => {
    if (r < guesses.length) return { letters: guesses[r], marks: evaluations[r], active: false };
    if (r === guesses.length) return { letters: current, marks: undefined, active: true };
    return { letters: "", marks: undefined, active: false };
  });

  return (
    <div className="space-y-5 p-4 @lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <AppIcon className="size-3.5" />
            {copy.eyebrow}
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            {copy.title}
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{copy.intro}</p>
        </div>
      </header>

      <div
        ref={boardRef}
        role="application"
        aria-label="Cipher board — type letters, Enter to submit"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <div className={`mx-auto grid w-full max-w-[19rem] gap-1.5 ${shake ? "cipher-shake" : ""}`}>
          {rows.map((row, r) => (
            <div key={r} className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: LEN }, (_, c) => {
                const ch = row.letters[c] ?? "";
                const mark = row.marks?.[c];
                return (
                  <div
                    key={c}
                    className="grid aspect-square place-items-center rounded-sm border border-border/70 bg-background/40 font-display text-lg font-bold @sm:text-xl"
                    style={markStyle(mark, Boolean(ch))}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[24rem] space-y-1.5">
        {KEYBOARD_ROWS.map((rowKeys, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {ri === 2 ? (
              <button
                type="button"
                onClick={submit}
                className="min-w-9 rounded-sm border border-border/70 px-2 py-2.5 font-mono text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                Enter
              </button>
            ) : null}
            {rowKeys.split("").map((ch) => {
              const mark = keyState[ch];
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => type(ch)}
                  className="min-w-[1.65rem] flex-1 rounded-sm border border-border/70 py-2.5 text-center font-mono text-[0.7rem] font-semibold text-foreground transition hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none @sm:min-w-7"
                  style={markStyle(mark, false)}
                >
                  {ch}
                </button>
              );
            })}
            {ri === 2 ? (
              <button
                type="button"
                onClick={backspace}
                className="min-w-9 rounded-sm border border-border/70 px-2 py-2.5 font-mono text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                Del
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {status !== "playing" ? (
        <div className="rounded-md border border-primary/40 bg-gradient-to-b from-primary/10 to-background/40 p-4 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            {status === "won" ? "Key decrypted" : "Decryption failed"}
          </p>
          <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
            key was <span className="text-gold">{answer}</span>
            {status === "won" ? ` · ${guesses.length}/${TRIES}` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            New key
          </button>
        </div>
      ) : (
        <p className="text-center font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground">
          {TRIES - guesses.length} attempts remaining · click board for physical keyboard
        </p>
      )}
    </div>
  );
}
