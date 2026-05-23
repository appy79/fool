"use client";

import { telecomScenarios } from "./data";
import TelecomScene from "./TelecomScene";
import useTelecomCoreLab from "./useTelecomCoreLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabProgressBar from "../../shared/LabProgressBar";
import LabScenarioSelector from "../../shared/LabScenarioSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function TelecomCoreExhibit() {
  const lab = useTelecomCoreLab();

  return (
    <LabExhibitLayout
      id="telecom-lab"
      badge="Foundations Exhibit"
      title="3GPP Telecom Core Simulator."
      description="Start a subscriber event and watch the packet move through access, core, policy, charging, event streaming, microservices, persistence, and billing without stepping through prompts."
      selector={<LabScenarioSelector items={telecomScenarios} activeId={lab.scenario.id} onSelect={lab.selectScenario} />}
      exhibitTitle={lab.scenario.name}
      exhibitDescription={lab.scenario.summary}
      signals={lab.scenario.signals}
      signalsDescription="Static characteristics of the selected telecom flow."
      proof="Telecom flows are about explicit boundaries: access context, control-plane validation, charging, asynchronous delivery, persistence, and recovery behavior all need to line up."
      scene={
        <TelecomScene
          scenario={lab.scenario}
          activeIndex={lab.activeIndex}
          activeStage={lab.activeStage}
          activeOutput={lab.activeOutput}
          bypassNotes={lab.bypassNotes}
          guardrailReached={lab.guardrailReached}
          guardrailPosition={lab.guardrailPosition}
          onStageSelect={lab.selectStage}
        />
      }
      controls={
        <div className="space-y-4">
          <LabProgressBar percent={lab.routeProgress} />
          <LabExhibitControls
            playLabel={lab.isSimulating ? "Flow running..." : lab.isComplete ? "Replay animated flow" : lab.scenario.trigger}
            onPlay={lab.start}
            resetLabel="Reset Flow"
            onReset={lab.reset}
            activeStepIndex={lab.insightStepIndex}
            stepCount={lab.activeInsight.steps.length}
            onStepSelect={lab.selectStep}
          />
        </div>
      }
      stepPanel={
        <LiveStepPanel
          label="Current Step"
          title={lab.activeStage.label}
          description={lab.isComplete ? "Billing outcome received. The subscriber event completed the production path." : lab.activeStage.description}
          insight={lab.activeInsight}
          activeStepIndex={lab.insightStepIndex}
          onStepSelect={lab.selectStep}
        />
      }
    />
  );
}
