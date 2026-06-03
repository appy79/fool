"use client";

import { useEffect, useRef } from "react";
import { useOS } from "../osStore";
import Dock from "./Dock";
import MenuBar from "./MenuBar";
import WindowManager from "./WindowManager";

export default function DesktopOS() {
  const { windows, openApp } = useOS();
  const booted = useRef(false);

  // Open the operator profile once on entry so the desktop is never empty.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    openApp("operator");
  }, [openApp]);

  const hasVisibleWindow = windows.some((win) => !win.minimized);

  return (
    <div className="relative h-full w-full">
      <MenuBar />

      {!hasVisibleWindow ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
            select an app from the dock
          </p>
        </div>
      ) : null}

      <WindowManager />
      <Dock />
    </div>
  );
}
