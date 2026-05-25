import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import { blank, tapeRadius } from "./data";
import type { Direction } from "../../types";

type TuringTapeSceneProps = {
  tape: Map<number, string>;
  head: number;
  state: string;
  lastMove: Direction;
  clackTick: number;
  isRunning: boolean;
  lastTransition: string;
  steps: number;
  stepCount: number;
};

function readCell(tape: Map<number, string>, index: number) {
  return tape.get(index) ?? blank;
}

const canvas = { width: 920, height: 450 };

export default function TuringTapeScene({
  tape,
  head,
  state,
  lastMove,
  clackTick,
  isRunning,
  lastTransition,
  steps,
  stepCount,
}: TuringTapeSceneProps) {
  const visibleCells = Array.from({ length: tapeRadius * 2 + 1 }, (_, index) => head - tapeRadius + index);

  return (
    <LabSceneFrame className="border-amber-900/50 bg-[#201811] p-0 text-amber-50 shadow-2xl shadow-amber-950/25">
      <ScaledSceneCanvas
        className="bg-[#201811]"
        height={canvas.height}
        innerClassName="p-4"
        role="img"
        aria-label={`Turing machine tape animation showing state ${state}, head position ${head}, and ${steps} of ${stepCount} steps completed`}
        width={canvas.width}
      >
        <style>
          {`
            @keyframes turing-head-clack {
              0% { transform: translateY(-4px) rotate(-0.5deg); }
              38% { transform: translateY(12px) rotate(0.5deg); }
              62% { transform: translateY(5px) rotate(-0.25deg); }
              100% { transform: translateY(0) rotate(0deg); }
            }
            @keyframes turing-tape-shift-left {
              0% { transform: translateX(-68px); }
              100% { transform: translateX(0); }
            }
            @keyframes turing-tape-shift-right {
              0% { transform: translateX(68px); }
              100% { transform: translateX(0); }
            }
            @keyframes turing-tape-stamp {
              0% { transform: translateY(0); }
              42% { transform: translateY(3px); }
              100% { transform: translateY(0); }
            }
            @keyframes turing-reel-spin {
              to { transform: rotate(360deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              .turing-motion {
                animation: none !important;
                transition: none !important;
              }
            }
          `}
        </style>

        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-100/10 bg-black/25 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/80">
              TM-1956 Tape Console
            </p>
            <p className="mt-1 font-mono text-sm text-amber-100">
              READ HEAD: {head} / MOVE: {lastMove} / STATE: {state}
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em]">
            <span className={`h-3 w-3 rounded-full ${isRunning ? "animate-pulse bg-emerald-300 motion-reduce:animate-none" : "bg-amber-900"}`} />
            {clackTick > 0 ? (
              <span key={`clack-label-${clackTick}`} className="rounded-full border border-amber-100/20 bg-amber-100/10 px-3 py-1 text-amber-100 animate-pulse motion-reduce:animate-none">
                {lastMove === "S" ? "CLACK" : lastMove === "R" ? "CLICK ->" : "<- CLACK"}
              </span>
            ) : (
              <span className="rounded-full border border-amber-100/10 px-3 py-1 text-amber-200/60">IDLE</span>
            )}
          </div>
        </div>

        <div className="relative h-[336px] overflow-hidden rounded-[1.5rem] border border-amber-100/10 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.14),transparent_34%),linear-gradient(180deg,#332315,#120d08)]">
          {["left", "right"].map((side) => (
            <div
              key={side}
              className={`turing-motion pointer-events-none absolute top-10 z-0 h-32 w-32 rounded-full border border-amber-100/20 bg-[conic-gradient(from_0deg,#3b2a1c,#c0842f,#2a1e14,#8a5a1f,#3b2a1c)] shadow-inner shadow-black/70 ${side === "left" ? "left-7" : "right-7"}`}
              style={{
                animationDuration: "1.4s",
                animationDirection: side === "left" ? "reverse" : "normal",
                animationIterationCount: "infinite",
                animationName: isRunning ? "turing-reel-spin" : "none",
                animationTimingFunction: "linear",
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/20 bg-[#160f09]" />
              <div className="absolute left-1/2 top-4 h-5 w-5 -translate-x-1/2 rounded-full bg-black/45" />
              <div className="absolute bottom-4 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-black/45" />
              <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-black/45" />
              <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-black/45" />
            </div>
          ))}

        <div className="absolute left-1/2 top-12 z-20 w-28 -translate-x-1/2 text-center">
          <div
            key={`head-${clackTick}`}
            className="turing-motion mx-auto"
            style={{
              animationDuration: "280ms",
              animationName: clackTick > 0 ? "turing-head-clack" : "none",
              animationTimingFunction: "ease-out",
            }}
          >
            <div className="mx-auto rounded-t-2xl border border-amber-100/30 bg-gradient-to-b from-stone-300 to-stone-700 px-3 py-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-stone-950 shadow-xl shadow-black/50">
              R/W Head
            </div>
            <div className="mx-auto h-[4.6rem] w-3 bg-gradient-to-b from-stone-500 to-amber-200 shadow-lg shadow-amber-200/20" />
            <div className="mx-auto h-0 w-0 border-l-[13px] border-r-[13px] border-t-[28px] border-l-transparent border-r-transparent border-t-amber-200 drop-shadow-[0_8px_12px_rgba(251,191,36,0.45)]" />
          </div>
        </div>

        <div className="absolute left-0 right-0 top-[150px] z-10 border-y border-amber-950/60 bg-[#d7b46a] py-4 shadow-2xl shadow-black/50">
          <div className="absolute left-0 right-0 top-2 flex justify-around">
            {Array.from({ length: 34 }).map((_, index) => (
              <span key={`top-hole-${index}`} className="h-2 w-2 rounded-full bg-[#5c3a16]/65" />
            ))}
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-around">
            {Array.from({ length: 34 }).map((_, index) => (
              <span key={`bottom-hole-${index}`} className="h-2 w-2 rounded-full bg-[#5c3a16]/65" />
            ))}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-[4.45rem] -translate-x-1/2 border-x border-amber-950/50 bg-amber-50/20 shadow-[0_0_30px_rgba(251,191,36,0.45)]" />
          <div className="overflow-hidden px-0 pb-1 pt-4">
            <div className="relative left-1/2 w-max -translate-x-1/2">
              <div
                key={`tape-${clackTick}`}
                className="turing-motion flex justify-center gap-1"
                style={{
                  animation:
                    clackTick > 0
                      ? `${lastMove === "L" ? "turing-tape-shift-left" : lastMove === "R" ? "turing-tape-shift-right" : "turing-tape-stamp"} 320ms ease-out`
                      : undefined,
                }}
              >
                {visibleCells.map((index) => {
                  const active = index === head;
                  const value = readCell(tape, index);

                  return (
                    <div key={index} className="flex w-16 flex-col items-center gap-1">
                      <div
                        className={`grid h-16 w-16 place-items-center border-y border-r border-[#6b481f]/45 font-mono text-2xl font-black transition motion-reduce:transition-none ${
                          active
                            ? "bg-amber-50 text-slate-950 shadow-[0_0_28px_rgba(251,191,36,0.65)]"
                            : "bg-[#e5c982] text-[#4a2f11]"
                        }`}
                      >
                        {value}
                      </div>
                      <span className="font-mono text-[0.62rem] text-[#5c3a16]">{index}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 right-5 z-20 grid grid-cols-3 gap-3 rounded-2xl border border-amber-100/10 bg-black/30 p-3 font-mono text-xs text-amber-100/80">
          <span>READ: {readCell(tape, head)}</span>
          <span>WRITE: {lastTransition.includes("write") ? lastTransition.split("write ")[1]?.split(",")[0] : "-"}</span>
          <span>STEPS: {steps}/{stepCount}</span>
        </div>
        </div>
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
