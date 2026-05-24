"use client";

import { useEffect, useState } from "react";
import LabManifest from "./shell/LabManifest";
import { labExhibits } from "./shell/labRegistry";
import useActiveLab from "./shell/useActiveLab";
import { LabProgramManifestProvider } from "./shared/LabProgramManifestContext";

export default function EngineeringSystemsLab() {
  const { activeLab, setActiveLabId } = useActiveLab();
  const [shouldPulseSelectors, setShouldPulseSelectors] = useState(true);
  const ActiveLab = activeLab.component;

  useEffect(() => {
    const timeout = window.setTimeout(() => setShouldPulseSelectors(false), 5400);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="labs-theme min-h-screen px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-[96rem] flex-col gap-5">
        <div key={activeLab.id} className="min-w-0">
          <LabProgramManifestProvider
            shouldPulseSelectors={shouldPulseSelectors}
            manifest={
              <LabManifest
                labs={labExhibits}
                activeLabId={activeLab.id}
                onSelectLab={(labId) => {
                  setShouldPulseSelectors(false);
                  setActiveLabId(labId);
                }}
              />
            }
          >
            <ActiveLab />
          </LabProgramManifestProvider>
        </div>
      </div>
    </main>
  );
}
