"use client";

import type { ResolvedContactInfo } from "@/lib/resume";
import LabContactCTA from "./shell/LabContactCTA";
import LabsHero from "./shell/LabsHero";
import { labExhibits } from "./shell/labRegistry";
import useActiveLab from "./shell/useActiveLab";

type EngineeringSystemsLabProps = {
  contact: ResolvedContactInfo;
};

export default function EngineeringSystemsLab({ contact }: EngineeringSystemsLabProps) {
  const { activeLab, setActiveLabId } = useActiveLab();
  const ActiveLab = activeLab.component;

  return (
    <main className="labs-theme relative min-h-screen py-8 text-foreground sm:py-10">
      <div className="glass mx-auto flex max-w-[96rem] flex-col gap-6 rounded-[2rem] border border-border/70 bg-card/85 px-4 py-5 shadow-2xl shadow-slate-900/10 dark:bg-background/80 dark:shadow-slate-950/20 sm:px-6 lg:px-8">
        <LabsHero labs={labExhibits} activeLabId={activeLab.id} onSelectLab={setActiveLabId} />

        <div key={activeLab.id} className="min-w-0">
          <ActiveLab />
        </div>

        <LabContactCTA contact={contact} />
      </div>
    </main>
  );
}
