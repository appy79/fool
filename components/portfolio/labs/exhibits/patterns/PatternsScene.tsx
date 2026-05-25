import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";

type PatternSceneProps = {
  pattern: {
    id: string;
    parts: readonly string[];
  };
  activePart: number;
};

const canvas = { width: 900, height: 380 };

export default function PatternsScene({ pattern, activePart }: PatternSceneProps) {
  const positions =
    pattern.id === "observer"
      ? [
          { x: 110, y: 205 },
          { x: 330, y: 205 },
          { x: 555, y: 120 },
          { x: 780, y: 205 },
        ]
      : pattern.id === "breaker"
        ? [
            { x: 110, y: 205 },
            { x: 330, y: 205 },
            { x: 555, y: 118 },
            { x: 780, y: 288 },
          ]
        : [
            { x: 110, y: 205 },
            { x: 330, y: 205 },
            { x: 555, y: 120 },
            { x: 780, y: 205 },
          ];
  const activePosition = positions[activePart] ?? positions[0];

  return (
    <LabSceneFrame className="p-0">
      <ScaledSceneCanvas
        aria-label="Design pattern machine animation"
        className="bg-[#1f1307]"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="absolute left-[8%] top-[76%] h-6 w-[84%] rounded-full border-y-[10px] border-dashed border-amber-900/25" />
        <div className="absolute left-[7%] top-[10%] h-24 w-24 rounded-full border-[8px] border-dashed border-amber-500/15" />
        <div className="absolute right-[6%] top-[64%] h-32 w-32 rounded-full border-[10px] border-dashed border-rose-400/15" />

        {pattern.id === "strategy" ? (
          <div className={`absolute left-[38%] top-[60%] rounded-2xl border border-orange-300/50 bg-orange-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition ${activePart >= 1 ? "opacity-100" : "opacity-25"}`}>
            runtime branch
          </div>
        ) : null}
        {pattern.id === "adapter" ? (
          <div className={`absolute left-[29%] top-[66%] rounded-2xl border border-orange-300/50 bg-orange-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition ${activePart >= 1 ? "opacity-100" : "opacity-25"}`}>
            translate payload
          </div>
        ) : null}
        {pattern.id === "observer" ? (
          <div className={`absolute left-[72%] top-[16%] rounded-2xl border border-amber-300/50 bg-amber-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100 transition ${activePart >= 2 ? "opacity-100" : "opacity-25"}`}>
            fan-out
          </div>
        ) : null}
        {pattern.id === "breaker" ? (
          <>
            <div className={`absolute left-[48%] top-[15%] rounded-2xl border border-red-300/50 bg-red-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-100 transition ${activePart >= 1 ? "opacity-100" : "opacity-25"}`}>
              risky dependency
            </div>
            <div className={`absolute left-[64%] top-[83%] rounded-2xl border border-emerald-300/50 bg-emerald-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition ${activePart >= 1 ? "opacity-100" : "opacity-25"}`}>
              fallback path
            </div>
          </>
        ) : null}

        {positions.slice(0, -1).map((position, index) => {
          const next = positions[index + 1];
          const completed = index < activePart;

          return (
            <SceneConnector
              key={`${position.x}-${next.x}`}
              canvasHeight={canvas.height}
              canvasWidth={canvas.width}
              className={completed ? "bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.65)]" : "bg-amber-950"}
              from={position}
              thickness={completed ? 8 : 4}
              to={next}
            />
          );
        })}

        {pattern.parts.map((part, index) => {
          const position = positions[index];
          const active = index === activePart;
          const completed = index < activePart;

          return (
            <div
              key={part}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 motion-reduce:transition-none"
              style={scenePointStyle(position, canvas.width, canvas.height)}
            >
              {active ? <div className="absolute inset-[-0.7rem] animate-ping rounded-[1.8rem] bg-amber-400/20 motion-reduce:animate-none" /> : null}
              <div
                className={`relative grid h-20 min-w-36 place-items-center rounded-[1.4rem] border-2 px-4 text-center text-sm font-extrabold shadow-xl transition motion-reduce:transition-none ${
                  active
                    ? "border-amber-100 bg-amber-400 text-stone-950 shadow-amber-500/35"
                    : completed
                      ? "border-orange-300 bg-orange-900 text-orange-50 shadow-orange-500/20"
                      : "border-orange-400 bg-[#29200e] text-orange-50"
                }`}
              >
                {part}
              </div>
            </div>
          );
        })}

        <div
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-amber-50 shadow-[0_0_18px_rgba(254,243,199,0.9)] transition-all duration-700 motion-reduce:animate-none motion-reduce:transition-none"
          style={scenePointStyle(activePosition, canvas.width, canvas.height)}
        />
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
