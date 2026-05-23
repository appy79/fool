"use client";

import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";
import { mergeLabInsight } from "../../utils/insight";
import { labInsight, machinePresets } from "./data";
import TuringTapeScene from "./TuringTapeScene";
import useTuringMachine from "./useTuringMachine";

export default function TuringTapeExhibit() {
  const machine = useTuringMachine();
  const activeInsight = mergeLabInsight(labInsight, machine.preset.insightSteps);

  return (
    <LabExhibitLayout
      id="turing-lab"
      badge="Flagship Exhibit"
      programTitle="Turing Tape Simulator."
      programDescription="Watch a fixed read/write head click and clack over an old-style tape while the machine mutates memory."
      moduleSelector={<LabModuleSelector items={machinePresets} activeId={machine.preset.id} onSelect={machine.selectPreset} />}
      moduleTitle={machine.preset.name}
      moduleDescription={machine.preset.goal}
      gridClassName="xl:grid-cols-[1.45fr_0.85fr]"
      signals={machine.preset.metrics}
      moduleSignalsDescription="Static characteristics of the loaded machine module."
      proof={machine.preset.explanation}
      proofDetail={
        <div className="rounded-3xl border border-border/70 bg-card/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Efficiency Note
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">{machine.preset.complexityNote}</p>
        </div>
      }
      scene={
        <TuringTapeScene
          tape={machine.tape}
          head={machine.head}
          state={machine.state}
          lastMove={machine.lastMove}
          clackTick={machine.clackTick}
          isRunning={machine.isRunning}
          lastTransition={machine.lastTransition}
          steps={machine.steps}
          stepCount={activeInsight.steps.length}
        />
      }
      controls={
        <LabExhibitControls
          playLabel={machine.isRunning ? "Pause machine" : "Run machine"}
          onPlay={machine.isRunning ? machine.stop : machine.run}
          playDisabled={!machine.isRunning && machine.isHalted}
          resetLabel="Reset"
          onReset={() => machine.reset()}
          activeStepIndex={machine.insightStepIndex}
          stepCount={activeInsight.steps.length}
          onStepSelect={machine.selectStep}
          previousDisabled={machine.isRunning || !machine.canRewind}
          nextDisabled={machine.isRunning || machine.isHalted || machine.steps >= activeInsight.steps.length}
          allowNextAtEnd={machine.steps < activeInsight.steps.length}
        />
      }
      stepPanel={
        <LiveStepPanel
          label="Current Step"
          title={machine.lastTransition}
          insight={activeInsight}
          activeStepIndex={machine.insightStepIndex}
          onStepSelect={machine.selectStep}
        />
      }
    />
  );
}
