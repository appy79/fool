"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNotifications } from "../../../notifications";

type Note = { id: string; body: string; updatedAt: number };

const STORAGE_KEY = "terminusos.notes.v1";

const STARTER =
  "Scratchpad\n\nThese notes live only in this browser — nothing is sent anywhere.\nWrite freely; everything autosaves.\n\n— TerminusOS";

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

function titleOf(body: string) {
  const line = body
    .split("\n")
    .map((value) => value.trim())
    .find(Boolean);
  return line ? line.slice(0, 42) : "Untitled note";
}

function previewOf(body: string) {
  const rest = body.split("\n").slice(1).join(" ").trim();
  return rest ? rest.slice(0, 60) : "No additional text";
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const data = JSON.parse(stored);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (item): item is Note =>
          Boolean(item) &&
          typeof item.id === "string" &&
          typeof item.body === "string" &&
          typeof item.updatedAt === "number",
      )
      .map((item) => ({ id: item.id, body: item.body, updatedAt: item.updatedAt }));
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Storage unavailable — notes still work for the session.
  }
}

type NotesState = { notes: Note[]; activeId: string | null };

function initialState(): NotesState {
  const loaded = loadNotes();
  const notes =
    loaded.length > 0
      ? [...loaded].sort((a, b) => b.updatedAt - a.updatedAt)
      : [{ id: uid(), body: STARTER, updatedAt: Date.now() }];
  return { notes, activeId: notes[0]?.id ?? null };
}

export default function NotesApp() {
  const { notify } = useNotifications();
  // Notes + selection are read straight from localStorage at mount (client-only app body).
  const [{ notes, activeId }, setState] = useState<NotesState>(initialState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveNotes(notes), 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [notes]);

  const active = notes.find((note) => note.id === activeId) ?? null;

  const stats = useMemo(() => {
    if (!active) return { chars: 0, words: 0 };
    const trimmed = active.body.trim();
    return {
      chars: active.body.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
    };
  }, [active]);

  const selectNote = (id: string) => setState((prev) => ({ ...prev, activeId: id }));

  const createNote = () => {
    const note: Note = { id: uid(), body: "", updatedAt: Date.now() };
    setState((prev) => ({ notes: [note, ...prev.notes], activeId: note.id }));
  };

  const updateActive = (body: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) =>
        note.id === prev.activeId ? { ...note, body, updatedAt: Date.now() } : note,
      ),
    }));
  };

  const deleteActive = () => {
    if (!active) return;
    setState((prev) => {
      const remaining = prev.notes.filter((note) => note.id !== prev.activeId);
      return { notes: remaining, activeId: remaining[0]?.id ?? null };
    });
    notify("Note deleted", { tone: "warn" });
  };

  return (
    <div className="flex h-full min-h-0 flex-col @lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border/60 @lg:w-60 @lg:border-b-0 @lg:border-r">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
            notes // local
          </span>
          <button
            type="button"
            onClick={createNote}
            aria-label="New note"
            className="grid size-6 place-items-center rounded-md border border-border/70 text-foreground transition hover:border-primary/60 hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            +
          </button>
        </div>
        <ul className="max-h-40 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 @lg:max-h-none">
          {notes.length === 0 ? (
            <li className="px-2 py-3 text-xs text-muted-foreground">No notes yet.</li>
          ) : (
            notes.map((note) => {
              const isActive = note.id === activeId;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => selectNote(note.id)}
                    className={`mb-1 flex w-full flex-col gap-0.5 rounded-lg border px-2.5 py-2 text-left transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                      isActive
                        ? "border-primary/55 bg-primary/10"
                        : "border-transparent hover:border-border/70 hover:bg-card/60"
                    }`}
                  >
                    <span className="truncate text-[0.78rem] font-semibold text-foreground">
                      {titleOf(note.body)}
                    </span>
                    <span className="truncate text-[0.66rem] text-muted-foreground">
                      {previewOf(note.body)}
                    </span>
                    <span className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted-foreground/70">
                      {relativeTime(note.updatedAt)}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col">
        {active ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-2.5">
              <span className="truncate font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                {titleOf(active.body)}
              </span>
              <button
                type="button"
                onClick={deleteActive}
                className="shrink-0 rounded-md border border-border/70 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-destructive/60 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                Delete
              </button>
            </div>
            <textarea
              value={active.body}
              onChange={(event) => updateActive(event.target.value)}
              spellCheck={false}
              placeholder="Start typing…"
              aria-label="Note body"
              className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[0.82rem] leading-7 text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none"
            />
            <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground/70">
              <span>
                {stats.words} words · {stats.chars} chars
              </span>
              <span>autosaved · {relativeTime(active.updatedAt)}</span>
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">No note selected.</p>
              <button
                type="button"
                onClick={createNote}
                className="mt-3 rounded-lg border border-primary/45 bg-primary/10 px-4 py-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                New note
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
