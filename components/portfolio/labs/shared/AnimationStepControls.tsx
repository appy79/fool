import { Button } from "@/components/ui/button";

type AnimationStepControlsProps = {
  activeStepIndex: number;
  stepCount: number;
  onStepSelect: (stepIndex: number) => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  allowNextAtEnd?: boolean;
};

export default function AnimationStepControls({
  activeStepIndex,
  stepCount,
  onStepSelect,
  previousDisabled = false,
  nextDisabled = false,
  allowNextAtEnd = false,
}: AnimationStepControlsProps) {
  return (
    <>
      <Button
        className="w-10 px-0"
        size="sm"
        variant="outline"
        aria-label="Previous step"
        disabled={previousDisabled || activeStepIndex <= 0}
        onClick={() => onStepSelect(Math.max(activeStepIndex - 1, 0))}
      >
        {"<"}
      </Button>
      <Button
        className="w-10 px-0"
        size="sm"
        variant="outline"
        aria-label="Next step"
        disabled={nextDisabled || (!allowNextAtEnd && activeStepIndex >= stepCount - 1)}
        onClick={() => onStepSelect(activeStepIndex + 1)}
      >
        {">"}
      </Button>
    </>
  );
}
