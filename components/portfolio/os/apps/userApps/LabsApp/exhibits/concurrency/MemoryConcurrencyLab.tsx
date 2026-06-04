"use client";

import { concurrencyModes } from "./data";
import ConcurrencyScene from "./ConcurrencyScene";
import useConcurrencyLab from "./useConcurrencyLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function MemoryConcurrencyLab() {
  const lab = useConcurrencyLab();

  return (
    <LabExhibitLayout
      id="concurrency-lab"
      programTitle="Memory and race visualizer."
      moduleSelector={
        <LabModuleSelector
          items={concurrencyModes}
          activeId={lab.mode.id}
          onSelect={lab.selectMode}
        />
      }
      moduleTitle={lab.mode.name}
      signals={lab.mode.metrics}
      proof="Performance work is also correctness work. Concurrency primitives change throughput, memory isolation, context switching, and whether the final state can be trusted."
      scene={<ConcurrencyScene {...lab.scene} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Threads scheduled..." : lab.mode.trigger}
          onPlay={lab.start}
          resetLabel="Reset Cycle"
          onReset={lab.reset}
          activeStepIndex={lab.insightStepIndex}
          stepCount={lab.activeInsight.steps.length}
          onStepSelect={lab.selectStep}
        />
      }
      stepPanel={
        <LiveStepPanel
          label="Current Step"
          title={lab.currentPhase}
          description={lab.liveDescription}
          insight={lab.activeInsight}
          activeStepIndex={lab.insightStepIndex}
          onStepSelect={lab.selectStep}
        />
      }
    />
  );
}
