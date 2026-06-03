import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LabSceneFrameProps = {
  children: ReactNode;
  className?: string;
};

export default function LabSceneFrame({ children, className }: LabSceneFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 p-4 dark:bg-slate-950",
        className,
      )}
    >
      {children}
    </div>
  );
}
