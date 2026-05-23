"use client";

import { useState } from "react";
import { defaultLabId, labExhibits, type LabId } from "./labRegistry";

export default function useActiveLab() {
  const [activeLabId, setActiveLabId] = useState<LabId>(defaultLabId);
  const activeLab = labExhibits.find((lab) => lab.id === activeLabId) ?? labExhibits[0];

  return {
    activeLab,
    activeLabId,
    setActiveLabId,
  };
}
