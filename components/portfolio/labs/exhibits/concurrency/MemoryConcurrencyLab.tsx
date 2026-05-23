"use client";

import { concurrencyModes } from "./data";
import ConcurrencyScene from "./ConcurrencyScene";
import useConcurrencyLab from "./useConcurrencyLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabProgressBar from "../../shared/LabProgressBar";
import LabScenarioSelector from "../../shared/LabScenarioSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function MemoryConcurrencyLab() {
  const lab = useConcurrencyLab();

  return (
    <LabExhibitLayout
      id="concurrency-lab"
      badge="OS / Concurrency Exhibit"
      title="Memory and race visualizer."
      description="Watch threads contend for a shared counter, then compare locks, atomics, semaphores, queues, deadlocks, and multiprocessing-style isolation."
      selector={<LabScenarioSelector items={concurrencyModes} activeId={lab.mode.id} onSelect={lab.selectMode} />}
      exhibitTitle={lab.mode.name}
      exhibitDescription={lab.mode.summary}
      signals={lab.mode.metrics}
      signalsDescription="Static characteristics of the selected concurrency mode."
      proof="Performance work is also correctness work. Concurrency primitives change throughput, memory isolation, context switching, and whether the final state can be trusted."
      scene={<ConcurrencyScene {...lab.scene} />}
      controls={
        <div className="space-y-4">
          <LabProgressBar percent={lab.deadlocked ? 66 : lab.progress} variant={lab.deadlocked ? "destructive" : "primary"} />
          <LabExhibitControls
            playLabel={lab.isRunning ? "Threads scheduled..." : lab.mode.trigger}
            onPlay={lab.start}
            resetLabel="Reset Cycle"
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
