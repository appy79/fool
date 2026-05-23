"use client";

import LabManifest from "./shell/LabManifest";
import { labExhibits } from "./shell/labRegistry";
import useActiveLab from "./shell/useActiveLab";
import { LabProgramManifestProvider } from "./shared/LabProgramManifestContext";

export default function EngineeringSystemsLab() {
  const { activeLab, setActiveLabId } = useActiveLab();
  const ActiveLab = activeLab.component;

  return (
    <main className="labs-theme min-h-screen px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-[96rem] flex-col gap-5">
        <div key={activeLab.id} className="min-w-0">
          <LabProgramManifestProvider
            manifest={<LabManifest labs={labExhibits} activeLabId={activeLab.id} onSelectLab={setActiveLabId} />}
          >
            <ActiveLab />
          </LabProgramManifestProvider>
        </div>
      </div>
    </main>
  );
}
