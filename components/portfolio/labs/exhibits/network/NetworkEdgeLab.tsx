"use client";

import { networkScenarios } from "./data";
import NetworkScene from "./NetworkScene";
import useNetworkEdgeLab from "./useNetworkEdgeLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function NetworkEdgeLab() {
  const lab = useNetworkEdgeLab();

  return (
    <LabExhibitLayout
      id="network-lab"
      badge="Networking Exhibit"
      programTitle="DNS, edge, and CDN routing lab."
      programDescription="Follow a request from client to DNS, edge, CDN, origin, and app layers while latency and cache behavior change."
      moduleSelector={<LabModuleSelector items={networkScenarios} activeId={lab.scenario.id} onSelect={lab.selectScenario} />}
      moduleTitle={lab.scenario.name}
      moduleDescription={lab.scenario.summary}
      signals={lab.scenario.metrics}
      moduleSignalsDescription="Static characteristics of the loaded network path module."
      proof="Networking performance is a chain of resolution, routing, caching, protocol boundaries, and origin behavior."
      scene={<NetworkScene scenarioId={lab.scenario.id} route={lab.route} activeIndex={lab.activeIndex} activeNodeId={lab.activeNodeId} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Request in flight..." : lab.scenario.trigger}
          onPlay={lab.start}
          resetLabel="Reset Route"
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
