"use client";

import { type CSSProperties, type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ScaledSceneCanvasProps = HTMLAttributes<HTMLDivElement> & {
  width: number;
  height: number;
  children: ReactNode;
  innerClassName?: string;
};

export default function ScaledSceneCanvas({
  width,
  height,
  children,
  className,
  innerClassName,
  style,
  ...props
}: ScaledSceneCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const updateScale = () => {
      canvas.style.setProperty("--lab-scene-scale", `${canvas.clientWidth / width}`);
    };
    const observer = new ResizeObserver(updateScale);

    updateScale();
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={canvasRef}
      className={cn("relative w-full overflow-hidden rounded-[1.6rem]", className)}
      style={{ ...style, aspectRatio: `${width} / ${height}` }}
      {...props}
    >
      <div
        className={cn("absolute left-0 top-0 overflow-hidden", innerClassName)}
        style={
          {
            height,
            transform: "scale(var(--lab-scene-scale, 1))",
            transformOrigin: "left top",
            width,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
