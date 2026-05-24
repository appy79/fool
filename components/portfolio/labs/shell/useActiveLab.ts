"use client";

import { useState, useSyncExternalStore } from "react";
import { defaultLabId, labExhibits, labIds, type LabId } from "./labRegistry";

const isLabId = (value: string | null): value is LabId =>
  labIds.includes(value as LabId);

const subscribeToLocation = () => () => {};

const getLocationSearch = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.search;
};

const getServerLocationSearch = () => "";

export default function useActiveLab() {
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const requestedLabId = new URLSearchParams(locationSearch).get("lab");
  const [selectedLabId, setActiveLabId] = useState<LabId | null>(null);
  const activeLabId = selectedLabId ?? (isLabId(requestedLabId) ? requestedLabId : defaultLabId);

  const activeLab = labExhibits.find((lab) => lab.id === activeLabId) ?? labExhibits[0];

  return {
    activeLab,
    setActiveLabId,
  };
}
