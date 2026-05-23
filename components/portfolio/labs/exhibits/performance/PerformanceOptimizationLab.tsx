"use client";

import { performanceProfiles } from "./data";
import PerformanceScene from "./PerformanceScene";
import usePerformanceLab from "./usePerformanceLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function PerformanceOptimizationLab() {
  const lab = usePerformanceLab();

  return (
    <LabExhibitLayout
      id="performance-lab"
      badge="Performance Exhibit"
      programTitle="Optimization bench."
      programDescription="Animate the difference between brute force, indexes, parallel work, and cache fast paths."
      moduleSelector={<LabModuleSelector items={performanceProfiles} activeId={lab.profile.id} onSelect={lab.selectProfile} />}
      moduleTitle={lab.profile.name}
      moduleDescription={lab.profile.summary}
      signals={lab.profile.metrics}
      moduleSignalsDescription="Static tradeoffs for the loaded optimization module."
      proof="Optimization is a tradeoff between asymptotic cost, memory pressure, contention, data locality, and operational complexity."
      scene={<PerformanceScene profile={lab.profile} activeStage={lab.activeStage} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Benchmark running..." : lab.profile.trigger}
          onPlay={lab.start}
          resetLabel="Reset Bench"
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
