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
      moduleSelector={
        <LabModuleSelector
          items={distributedScenarios}
          activeId={lab.scenario.id}
          onSelect={lab.selectScenario}
        />
      }
      moduleTitle={lab.scenario.name}
      signals={lab.scenario.metrics}
      proof="Distributed systems are not just about services talking to each other. Correctness depends on order, causality, failure assumptions, and what every node believes happened."
      scene={<DistributedScene scenario={lab.scenario} phaseIndex={lab.phaseIndex} />}
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
          title={lab.activePhase.title}
          description={`${lab.activePhase.summary} Completed rounds: ${lab.rounds}`}
          insight={lab.activeInsight}
          activeStepIndex={lab.insightStepIndex}
          onStepSelect={lab.selectStep}
        />
      }
    />
  );
}
