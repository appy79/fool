"use client";

import { useEffect } from "react";
import { useOS } from "../osStore";
import AppFrame from "./AppFrame";
import HomeScreen from "./HomeScreen";
import StatusBar from "./StatusBar";

export default function MobileOS() {
  const { windows, focusedKey, appsById, closeWindow } = useOS();
  const focused = windows.find((win) => win.key === focusedKey) ?? null;
  const app = focused ? appsById.get(focused.appId) : undefined;

  // Hardware/browser back-style: Escape returns to the home screen from an app.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && focusedKey) {
        closeWindow(focusedKey);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedKey, closeWindow]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <StatusBar />
      <div className="relative min-h-0 flex-1">
        {focused && app ? <AppFrame app={app} win={focused} /> : <HomeScreen />}
      </div>
    </div>
  );
}
