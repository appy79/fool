"use client";

import { useEffect } from "react";
import { useOS } from "../osStore";
import Window from "./Window";

export default function WindowManager() {
  const { windows, appsById, focusedKey, closeWindow } = useOS();

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
    <div className="absolute inset-0">
      {windows
        .filter((win) => !win.minimized)
        .map((win) => {
          const app = appsById.get(win.appId);
          if (!app) return null;
          return <Window key={win.key} app={app} win={win} />;
        })}
    </div>
  );
}
