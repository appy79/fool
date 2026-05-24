"use client";

import { databaseAccessModules } from "./data";
import DatabaseScene from "./DatabaseScene";
import useDatabaseSystemsLab from "./useDatabaseSystemsLab";
import LabExhibitControls from "../../shared/LabExhibitControls";
import LabExhibitLayout from "../../shared/LabExhibitLayout";
import LabModuleSelector from "../../shared/LabModuleSelector";
import LiveStepPanel from "../../shared/LiveStepPanel";

export default function DatabaseSystemsLab() {
  const lab = useDatabaseSystemsLab();

  return (
    <LabExhibitLayout
      id="database-lab"
      badge="Database Systems Exhibit"
      programTitle="Database systems lab."
      programDescription="Animate query access paths across full scans, indexes, parallel execution, and cache fast paths."
      moduleSelector={<LabModuleSelector items={databaseAccessModules} activeId={lab.module.id} onSelect={lab.selectModule} />}
      moduleTitle={lab.module.name}
      moduleDescription={lab.module.summary}
      signals={lab.module.metrics}
      moduleSignalsDescription="Static tradeoffs for the loaded database access module."
      proof="Database performance is access-path design: query planning, indexes, buffer pressure, parallel execution, cache behavior, and consistency tradeoffs determine whether data systems stay fast."
      scene={<DatabaseScene module={lab.module} activeStage={lab.activeStage} />}
      controls={
        <LabExhibitControls
          playLabel={lab.isRunning ? "Query running..." : lab.module.trigger}
          onPlay={lab.start}
          resetLabel="Reset Query"
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
