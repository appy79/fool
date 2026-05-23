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
        className="h-auto min-w-0 flex-1 whitespace-normal break-words border-primary/35 bg-primary/10 text-primary shadow-sm shadow-primary/10 hover:bg-primary/15 hover:text-primary"
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
