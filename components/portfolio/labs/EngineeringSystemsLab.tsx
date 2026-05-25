"use client";

import { useEffect, useState } from "react";
import PortfolioFooter from "../shared/PortfolioFooter";
import styles from "../shared/portfolioTheme.module.css";
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
    <main id="main-content" className={`${styles.theme} min-h-screen px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8`}>
      <div className="mx-auto flex max-w-[96rem] flex-col gap-5">
        <header className="grid gap-3 border-y border-primary/25 py-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <p className="text-primary">&gt; seldon.systems.lab</p>
          <p className="min-w-0">Prime Radiant view of engineering tradeoffs, loaded program: {activeLab.label}</p>
          <p className="text-primary">plan.delta: monitored</p>
        </header>
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
        <PortfolioFooter activeSurface="labs" />
      </div>
    </main>
  );
}
