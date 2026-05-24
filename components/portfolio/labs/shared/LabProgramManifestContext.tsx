"use client";

import { createContext, type ReactNode, useContext } from "react";

const LabProgramManifestContext = createContext<ReactNode>(null);
const LabFirstLoadPulseContext = createContext(false);

type LabProgramManifestProviderProps = {
  children: ReactNode;
  manifest: ReactNode;
  shouldPulseSelectors?: boolean;
};

export function LabProgramManifestProvider({
  children,
  manifest,
  shouldPulseSelectors = false,
}: LabProgramManifestProviderProps) {
  return (
    <LabProgramManifestContext.Provider value={manifest}>
      <LabFirstLoadPulseContext.Provider value={shouldPulseSelectors}>
        {children}
      </LabFirstLoadPulseContext.Provider>
    </LabProgramManifestContext.Provider>
  );
}

export function useLabProgramManifest() {
  return useContext(LabProgramManifestContext);
}

export function useLabFirstLoadPulse() {
  return useContext(LabFirstLoadPulseContext);
}
