"use client";

import { designPatternScenarios } from "./data";
import PatternsScene from "./PatternsScene";
import usePatternsLab from "./usePatternsLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function DesignPatternsLab() {
  const lab = usePatternsLab();

  return (
    <LabExhibitLayout
      id="patterns-lab"
      programTitle="Design patterns machine."
      moduleSelector={
        <LabModuleSelector
          items={designPatternScenarios}
          activeId={lab.pattern.id}
          onSelect={lab.selectPattern}
        />
      }
      moduleTitle={lab.pattern.name}
      signals={lab.pattern.metrics}
      proof="Patterns are useful when they make a system easier to change, isolate risk, or express a stable boundary. The goal is tradeoff-aware design, not pattern collecting."
      scene={<PatternsScene pattern={lab.pattern} activePart={lab.activePart} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Pattern applying..." : lab.pattern.trigger}
          onPlay={lab.start}
          resetLabel="Reset Machine"
          onReset={lab.reset}
          activeStepIndex={lab.insightStepIndex}
          stepCount={lab.activeInsight.steps.length}
          onStepSelect={lab.selectStep}
        />
      }
      stepPanel={
        <LiveStepPanel
          label="Current Step"
          title={lab.liveTitle}
          insight={lab.activeInsight}
          activeStepIndex={lab.insightStepIndex}
          onStepSelect={lab.selectStep}
        />
      }
    />
  );
}
