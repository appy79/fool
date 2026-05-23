"use client";

import ComplexityScene from "./ComplexityScene";
import { complexityScenarios } from "./data";
import useComplexityLab from "./useComplexityLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabScenarioSelector from "../../shared/LabScenarioSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function ComplexityPuzzleLab() {
  const lab = useComplexityLab();

  return (
    <LabExhibitLayout
      id="complexity-lab"
      badge="Complexity Exhibit"
      title="P vs NP puzzle chamber."
      description="Watch the difference between checking one candidate solution and searching through an exploding state space."
      selector={<LabScenarioSelector items={complexityScenarios} activeId={lab.scenario.id} onSelect={lab.selectScenario} />}
      exhibitTitle={lab.scenario.name}
      exhibitDescription={lab.scenario.summary}
      signals={lab.scenario.metrics}
      signalsDescription="Static computational limits for the selected puzzle."
      proof="Good engineers do not only implement algorithms. They recognize when brute force is structurally doomed and when verification is easier than discovery."
      scene={<ComplexityScene isRouteSearch={lab.isRouteSearch} activeDepth={lab.activeDepth} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Search expanding..." : lab.scenario.trigger}
          onPlay={lab.start}
          resetLabel="Reset Search"
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
