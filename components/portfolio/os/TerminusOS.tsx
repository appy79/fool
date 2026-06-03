"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { ResolvedContactInfo } from "@/lib/resume";
import { APPS, preloadApp } from "./appRegistry";
import { AppRuntimeProvider } from "./AppRuntime";
import LockScreen from "./LockScreen";
import { OSSettingsProvider, useOSSettings } from "./osSettings";
import { OSProvider } from "./osStore";
import useMediaQuery from "./useMediaQuery";
import OSWallpaper from "./wallpaper/OSWallpaper";

function ShellLoading() {
  return (
    <div className="grid h-full w-full place-items-center">
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
        booting…
      </span>
    </div>
  );
}

// The shell (window manager, dock, menu bar, simulation) is only needed once the
// visitor enters, so it is split out of the initial bundle. The boot screen warms
// both chunks while the visitor reads, so entering — and later resizing across the
// desktop/mobile breakpoint — is instant.
const desktopShellLoader = () => import("./desktop/DesktopOS");
const mobileShellLoader = () => import("./mobile/MobileOS");

// Fetch both shells; we don't know if the visitor will resize across the breakpoint.
const preloadShells = () => Promise.allSettled([desktopShellLoader(), mobileShellLoader()]);

const DesktopOS = dynamic(desktopShellLoader, { ssr: false, loading: ShellLoading });
const MobileOS = dynamic(mobileShellLoader, { ssr: false, loading: ShellLoading });

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
  const { reduceMotion, installedApps } = useOSSettings();

  return (
    <div className={`os-root text-foreground ${reduceMotion ? "os-reduce-motion" : ""}`}>
      <OSWallpaper />
      <div className="relative z-10 h-full w-full">
        {entered ? (
          <OSProvider
            apps={APPS}
            contact={contact}
            installedApps={installedApps}
            preloadApp={preloadApp}
            onLock={() => setEntered(false)}
          >
            <AppRuntimeProvider>
              <div className="os-enter h-full w-full">
                {isDesktop ? <DesktopOS /> : <MobileOS />}
              </div>
            </AppRuntimeProvider>
          </OSProvider>
        ) : (
          <LockScreen
            contact={contact}
            onEnter={() => setEntered(true)}
            preloadShells={preloadShells}
          />
        )}
      </div>
    </div>
  );
}
