"use client";

import { PROMPT } from "./data";
import { useTerminal } from "./useTerminal";

export default function TerminalApp() {
  const { lines, input, setInput, onKeyDown, scrollRef, inputRef } = useTerminal();

  return (
    <label className="flex h-full w-full cursor-text flex-col bg-background/70 p-3 font-mono text-[0.72rem] leading-5 @sm:p-4 @sm:text-[0.78rem]">
      <span className="sr-only">Terminal — type a command and press enter</span>
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
        {lines.map((line) => (
          <p
            key={line.id}
            className={`whitespace-pre-wrap break-words ${
              line.tone === "in"
                ? "text-foreground"
                : line.tone === "warn"
                  ? "text-gold"
                  : line.tone === "muted"
                    ? "text-muted-foreground"
                    : "text-foreground/90"
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
      <div className="terminal-input-row mt-1 flex items-center gap-2">
        <span aria-hidden="true" className="shrink-0 text-primary">
          {PROMPT}:~$
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-foreground caret-primary outline-none"
        />
      </div>
    </label>
  );
}
