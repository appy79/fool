"use client";

import { distributedScenarios } from "./data";
import DistributedScene from "./DistributedScene";
import useDistributedSystemsLab from "./useDistributedSystemsLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function DistributedSystemsLab() {
  const lab = useDistributedSystemsLab();

  return (
    <LabExhibitLayout
      id="distributed-lab"
      programTitle="Consensus, clocks, and ordering lab."
      programDescription="Watch messages move between replicas while the lab visualizes ordering, causality, and fault tolerance."
      moduleSelector={<LabModuleSelector items={distributedScenarios} activeId={lab.scenario.id} onSelect={lab.selectScenario} />}
      moduleTitle={lab.scenario.name}
      moduleDescription={lab.scenario.summary}
      signals={lab.scenario.metrics}
      moduleSignalsDescription="Static invariants attached to the loaded protocol module."
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
