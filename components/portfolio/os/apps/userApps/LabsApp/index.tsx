"use client";

import { useState } from "react";
import { LabProgramManifestProvider } from "@/components/portfolio/labs/shared/LabProgramManifestContext";
import LabManifest from "@/components/portfolio/labs/shell/LabManifest";
import {
  defaultLabId,
  labExhibits,
  type LabId,
} from "@/components/portfolio/labs/shell/labRegistry";

export default function LabsApp() {
  const [activeLabId, setActiveLabId] = useState<LabId>(defaultLabId);
  const activeLab = labExhibits.find((lab) => lab.id === activeLabId) ?? labExhibits[0];
  const ActiveLab = activeLab.component;

  return (
    <div className="p-5 sm:p-7">
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
