"use client";

import { type MouseEvent as ReactMouseEvent, useEffect, useRef } from "react";
import { useNotifications } from "../notifications";
import { useOSSettings, WALLPAPERS } from "../osSettings";
import { useOS } from "../osStore";
import { ContextMenuProvider, type MenuItem, useContextMenu } from "./ContextMenu";
import Dock from "./Dock";
import MenuBar from "./MenuBar";
import WindowManager from "./WindowManager";

export default function DesktopOS() {
  return (
    <ContextMenuProvider>
      <DesktopSurface />
    </ContextMenuProvider>
  );
}

function DesktopSurface() {
  const { windows, openApp, closeAllWindows, lock } = useOS();
  const { wallpaper, setWallpaper, installApp, isInstalled, dockPosition } = useOSSettings();
  const { notify } = useNotifications();
  const { openMenu } = useContextMenu();
  const booted = useRef(false);

  // On entry: keep whatever windows were restored, otherwise open the operator profile so
  // the desktop is never empty. Announce a restore so the visitor knows it persisted.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    if (windows.length === 0) {
      openApp("operator");
    } else {
      const count = windows.length;
      notify(`Session restored — ${count} window${count > 1 ? "s" : ""}`, { tone: "info" });
    }
  }, [windows, openApp, notify]);

  const newNote = () => {
    if (!isInstalled("notes")) {
      // Don't install a module behind the visitor's back — ask first.
      notify("Notes isn't installed. Add it to your dock?", {
        tone: "info",
        actions: [
          {
            label: "Install & open",
            onSelect: () => {
              installApp("notes");
              notify("Notes installed — added to dock", { tone: "success" });
              openApp("notes");
            },
          },
        ],
      });
      return;
    }
    openApp("notes");
  };

  const cycleWallpaper = () => {
    const index = WALLPAPERS.findIndex((option) => option.id === wallpaper);
    const next = WALLPAPERS[(index + 1) % WALLPAPERS.length];
    setWallpaper(next.id);
    notify(`Wallpaper · ${next.label}`, { tone: "info" });
  };

  const onContextMenu = (event: ReactMouseEvent) => {
    // Let windows handle their own right-clicks (title menu / native text menu in app bodies).
    if ((event.target as HTMLElement).closest("[data-window]")) return;
    const items: MenuItem[] = [
      { label: "New note", onSelect: newNote },
      { label: "Next wallpaper", onSelect: cycleWallpaper },
      { label: "Settings…", onSelect: () => openApp("settings") },
      { separator: true },
      {
        label: "Close all windows",
        onSelect: closeAllWindows,
        disabled: windows.length === 0,
      },
      { label: "Lock screen", onSelect: lock },
    ];
    openMenu(event, items);
  };

  const hasVisibleWindow = windows.some((win) => !win.minimized);
  const dockLeft = dockPosition === "left";

  return (
    <div className="relative h-full w-full" onContextMenu={onContextMenu}>
      <MenuBar />

      {!hasVisibleWindow ? (
        <div
          className={`pointer-events-none absolute inset-0 grid place-items-center ${
            dockLeft ? "pl-16" : "pb-16"
          }`}
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
            right-click the desktop · or pick an app from the dock
          </p>
        </div>
      ) : null}

      <WindowManager />
      <Dock />
    </div>
  );
}
