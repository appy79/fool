"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text to the clipboard and exposes a transient `copied` flag for UI feedback.
 * Falls back to a hidden textarea + execCommand when the async Clipboard API is
 * unavailable (older browsers or non-secure contexts).
 */
export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetMs);
      } catch {
        // Clipboard access blocked; leave the flag unset so the UI shows no false success.
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
