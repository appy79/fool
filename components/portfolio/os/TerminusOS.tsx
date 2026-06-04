"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { ResolvedContactInfo } from "@/lib/resume";
import { APPS, preloadApp } from "./appRegistry";
import { AppRuntimeProvider } from "./AppRuntime";
import FirstRunGuide from "./FirstRunGuide";
import LockScreen from "./LockScreen";
import { NotificationProvider } from "./notifications";
import { OSSettingsProvider, useOSSettings } from "./osSettings";
import { OSProvider } from "./osStore";
import { readDeepLink } from "./urlState";
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
  // A shared deep link (?app=…) lands the visitor straight inside the system, skipping the
  // boot screen — the link's intent is the content, not the intro. A bare URL still boots.
  const [entered, setEntered] = useState(
    () => typeof window !== "undefined" && readDeepLink() !== null,
  );
  const isDesktop = useMediaQuery("(min-width: 820px)");
  const { reduceMotion, installedApps, dockPosition } = useOSSettings();

  // Record each entry (boot, deep link, or re-entry after a lock) exactly once per transition.
  const wasEntered = useRef(false);
  useEffect(() => {
    if (entered && !wasEntered.current) trackEvent("enter_system");
    wasEntered.current = entered;
  }, [entered]);

  // Mirror the visual viewport into CSS vars so `.os-root` shrinks to the area
  // above the mobile on-screen keyboard (instead of staying full-height and
  // hiding app content — e.g. the terminal input — behind it).
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--os-viewport-height", `${Math.round(vv.height)}px`);
      root.style.setProperty("--os-viewport-top", `${Math.round(vv.offsetTop)}px`);
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      root.style.removeProperty("--os-viewport-height");
      root.style.removeProperty("--os-viewport-top");
    };
  }, []);

  return (
    <div className={`os-root text-foreground ${reduceMotion ? "os-reduce-motion" : ""}`}>
      <OSWallpaper />
      <div className="relative z-10 h-full w-full">
        {entered ? (
          <OSProvider
            apps={APPS}
            contact={contact}
            installedApps={installedApps}
            dockPosition={dockPosition}
            preloadApp={preloadApp}
            onLock={() => setEntered(false)}
          >
            <NotificationProvider>
              <AppRuntimeProvider>
                <div className="os-enter h-full w-full">
                  {isDesktop ? <DesktopOS /> : <MobileOS />}
                </div>
                <FirstRunGuide />
              </AppRuntimeProvider>
            </NotificationProvider>
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
