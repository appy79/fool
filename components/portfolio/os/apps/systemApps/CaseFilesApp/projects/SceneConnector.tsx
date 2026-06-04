import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ScenePoint = {
  x: number;
  y: number;
};

type SceneConnectorProps = {
  from: ScenePoint;
  to: ScenePoint;
  canvasWidth: number;
  canvasHeight: number;
  className?: string;
  thickness?: number;
};

export function scenePointStyle(
  point: ScenePoint,
  canvasWidth: number,
  canvasHeight: number,
): CSSProperties {
  return {
    left: `${(point.x / canvasWidth) * 100}%`,
    top: `${(point.y / canvasHeight) * 100}%`,
  };
}

export default function SceneConnector({
  from,
  to,
  canvasWidth,
  canvasHeight,
  className,
  thickness = 4,
}: SceneConnectorProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full transition-all duration-500 motion-reduce:transition-none",
        className,
      )}
      style={{
        height: thickness,
        left: `${(from.x / canvasWidth) * 100}%`,
        top: `${(from.y / canvasHeight) * 100}%`,
        transform: `translateY(-50%) rotate(${angle}deg)`,
        transformOrigin: "left center",
        width: `${(length / canvasWidth) * 100}%`,
      }}
    />
  );
}
