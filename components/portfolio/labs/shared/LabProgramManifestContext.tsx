"use client";

import { createContext, type ReactNode, useContext } from "react";

const LabProgramManifestContext = createContext<ReactNode>(null);

type LabProgramManifestProviderProps = {
  children: ReactNode;
  manifest: ReactNode;
};

export function LabProgramManifestProvider({ children, manifest }: LabProgramManifestProviderProps) {
  return (
    <LabProgramManifestContext.Provider value={manifest}>
      {children}
    </LabProgramManifestContext.Provider>
  );
}

export function useLabProgramManifest() {
  return useContext(LabProgramManifestContext);
}
