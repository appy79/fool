"use client";

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useOS } from "../../../osStore";
import { useOSSettings } from "../../../osSettings";
import { runCommand } from "./commands";
import { BANNER } from "./data";
import type { Line, LineTone } from "./types";

/** Owns terminal state (lines, input, history) and wires it to the command engine. */
export function useTerminal() {
  const { apps, openApp, contact, lock } = useOS();
  const { installedApps, installApp, uninstallApp, isInstalled } = useOSSettings();
  const { resolvedTheme, setTheme } = useTheme();

  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((text, index) => ({ id: index, text, tone: "muted" as const })),
  );
  const [input, setInput] = useState("");
  const idRef = useRef(BANNER.length);
  const historyRef = useRef<string[]>([]);
  const histIndexRef = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (text: string, tone: LineTone = "out") =>
    setLines((current) => [...current, { id: idRef.current++, text, tone }]);
  const pushMany = (texts: string[], tone: LineTone = "out") =>
    setLines((current) => [
      ...current,
      ...texts.map((text) => ({ id: idRef.current++, text, tone })),
    ]);
  const clearLines = () => {
    setLines([]);
    idRef.current = 0;
  };

  const launchableApps = useMemo(
    () =>
      apps.filter((app) => !app.hidden && (app.kind !== "user" || installedApps.includes(app.id))),
    [apps, installedApps],
  );

  const run = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed) {
      historyRef.current = [trimmed, ...historyRef.current].slice(0, 50);
      histIndexRef.current = -1;
    }
    runCommand(raw, {
      apps,
      launchableApps,
      contact,
      resolvedTheme,
      push,
      pushMany,
      clearLines,
      openApp,
      installApp,
      uninstallApp,
      isInstalled,
      setTheme,
      lock,
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      run(input);
      setInput("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const history = historyRef.current;
      if (history.length === 0) return;
      histIndexRef.current = Math.min(histIndexRef.current + 1, history.length - 1);
      setInput(history[histIndexRef.current] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      histIndexRef.current = Math.max(histIndexRef.current - 1, -1);
      setInput(histIndexRef.current === -1 ? "" : (historyRef.current[histIndexRef.current] ?? ""));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return { lines, input, setInput, onKeyDown, scrollRef, inputRef };
}
