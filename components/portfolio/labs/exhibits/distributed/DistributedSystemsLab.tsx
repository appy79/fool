"use client";

import { distributedScenarios } from "./data";
import DistributedScene from "./DistributedScene";
import useDistributedSystemsLab from "./useDistributedSystemsLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabScenarioSelector from "../../shared/LabScenarioSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function DistributedSystemsLab() {
  const lab = useDistributedSystemsLab();

  return (
    <LabExhibitLayout
      id="distributed-lab"
      badge="Distributed Systems Exhibit"
      title="Consensus, clocks, and ordering lab."
      description="Watch messages move between replicas while the lab visualizes ordering, causality, and fault tolerance."
      selector={<LabScenarioSelector items={distributedScenarios} activeId={lab.scenario.id} onSelect={lab.selectScenario} />}
      exhibitTitle={lab.scenario.name}
      exhibitDescription={lab.scenario.summary}
      signals={lab.scenario.metrics}
      signalsDescription="Static invariants attached to the selected scenario."
      proof="Distributed systems are not just about services talking to each other. Correctness depends on order, causality, failure assumptions, and what every node believes happened."
      scene={<DistributedScene scenarioId={lab.scenario.id} phaseIndex={lab.phaseIndex} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Messages in flight..." : lab.scenario.trigger}
          onPlay={lab.start}
          resetLabel="Reset Round"
          onReset={lab.reset}
          activeStepIndex={lab.insightStepIndex}
          stepCount={lab.activeInsight.steps.length}
          onStepSelect={lab.selectStep}
        />
      }
      stepPanel={
        <LiveStepPanel
          label="Current Step"
          title={lab.activePhase}
          description={`Completed rounds: ${lab.rounds}`}
          insight={lab.activeInsight}
          activeStepIndex={lab.insightStepIndex}
          onStepSelect={lab.selectStep}
        />
      }
    />
  );
}
