"use client";

import { performanceProfiles } from "./data";
import PerformanceScene from "./PerformanceScene";
import usePerformanceLab from "./usePerformanceLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabScenarioSelector from "../../shared/LabScenarioSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function PerformanceOptimizationLab() {
  const lab = usePerformanceLab();

  return (
    <LabExhibitLayout
      id="performance-lab"
      badge="Performance Exhibit"
      title="Optimization bench."
      description="Animate the difference between brute force, indexes, parallel work, and cache fast paths."
      selector={<LabScenarioSelector items={performanceProfiles} activeId={lab.profile.id} onSelect={lab.selectProfile} />}
      exhibitTitle={lab.profile.name}
      exhibitDescription={lab.profile.summary}
      signals={lab.profile.metrics}
      signalsDescription="Static tradeoffs for the selected optimization strategy."
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
