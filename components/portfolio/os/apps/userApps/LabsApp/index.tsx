"use client";

import { useState } from "react";
import { LabProgramManifestProvider } from "./shared/LabProgramManifestContext";
import LabManifest from "./shell/LabManifest";
import { defaultLabId, labExhibits, type LabId } from "./shell/labRegistry";

export default function LabsApp() {
  const [activeLabId, setActiveLabId] = useState<LabId>(defaultLabId);
  const activeLab = labExhibits.find((lab) => lab.id === activeLabId) ?? labExhibits[0];
  const ActiveLab = activeLab.component;

  return (
    <div className="p-4 @lg:p-7">
      <LabProgramManifestProvider
        manifest={
          <LabManifest
            labs={labExhibits}
            activeLabId={activeLab.id}
            onSelectLab={(id) => setActiveLabId(id)}
          />
        }
      >
        <div key={activeLab.id} className="min-w-0">
          <ActiveLab />
        </div>
      </LabProgramManifestProvider>
    </div>
  );
}
