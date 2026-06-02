"use client";

import { useState } from "react";
import type { ResolvedContactInfo } from "@/lib/resume";
import { APPS } from "./appRegistry";
import DesktopOS from "./desktop/DesktopOS";
import LockScreen from "./LockScreen";
import MobileOS from "./mobile/MobileOS";
import { OSSettingsProvider, useOSSettings } from "./osSettings";
import { OSProvider } from "./osStore";
import useMediaQuery from "./useMediaQuery";
import OSWallpaper from "./wallpaper/OSWallpaper";

export default function TerminusOS({ contact }: { contact: ResolvedContactInfo }) {
  return (
    <OSSettingsProvider>
      <OSShell contact={contact} />
    </OSSettingsProvider>
  );
}

function OSShell({ contact }: { contact: ResolvedContactInfo }) {
  const [entered, setEntered] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 820px)");
  const { reduceMotion } = useOSSettings();

  return (
    <div className={`os-root text-foreground ${reduceMotion ? "os-reduce-motion" : ""}`}>
      <OSWallpaper />
      <div className="relative z-10 h-full w-full">
        {entered ? (
          <OSProvider apps={APPS} contact={contact} onLock={() => setEntered(false)}>
            <div className="os-enter h-full w-full">{isDesktop ? <DesktopOS /> : <MobileOS />}</div>
          </OSProvider>
        ) : (
          <LockScreen contact={contact} onEnter={() => setEntered(true)} />
        )}
      </div>
    </div>
  );
}
