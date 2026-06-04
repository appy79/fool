"use client";

import { useEffect, useState } from "react";
import { useOSSettings } from "./osSettings";

/** Minute-precision clock. Renders a stable placeholder until mounted to avoid hydration drift. */
export default function Clock({ className }: { className?: string }) {
  const { clock24h } = useOSSettings();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const raf = requestAnimationFrame(update);
    const id = window.setInterval(update, 30_000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  const text = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !clock24h })
    : "--:--";
  return <span className={className}>{text}</span>;
}
