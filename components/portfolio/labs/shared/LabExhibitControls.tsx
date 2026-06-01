import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import AnimationStepControls from "./AnimationStepControls";

type LabExhibitControlsProps = {
  playLabel: ReactNode;
  onPlay: () => void;
  resetLabel: ReactNode;
  onReset: () => void;
  activeStepIndex: number;
  stepCount: number;
  onStepSelect: (stepIndex: number) => void;
  playDisabled?: boolean;
  resetDisabled?: boolean;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  allowNextAtEnd?: boolean;
};

export default function LabExhibitControls({
  playLabel,
  onPlay,
  resetLabel,
  onReset,
  activeStepIndex,
  stepCount,
  onStepSelect,
  playDisabled = false,
  resetDisabled = false,
  previousDisabled = false,
  nextDisabled = false,
  allowNextAtEnd = false,
}: LabExhibitControlsProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <Button
        className="h-auto min-w-0 flex-1 whitespace-normal break-words border-primary/30 bg-primary/5 text-primary hover:bg-accent/35 hover:text-foreground"
        onClick={onPlay}
        disabled={playDisabled}
      >
        {playLabel}
      </Button>
      <AnimationStepControls
        activeStepIndex={activeStepIndex}
        stepCount={stepCount}
        onStepSelect={onStepSelect}
        previousDisabled={previousDisabled}
        nextDisabled={nextDisabled}
        allowNextAtEnd={allowNextAtEnd}
      />
      <Button className="h-auto min-w-0 flex-1 whitespace-normal break-words" onClick={onReset} variant="outline" disabled={resetDisabled}>
        {resetLabel}
      </Button>
    </div>
  );
}
