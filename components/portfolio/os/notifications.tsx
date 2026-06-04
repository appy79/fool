"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastTone = "info" | "success" | "warn";

export type ToastAction = { label: string; onSelect: () => void };

type Toast = { id: number; message: string; tone: ToastTone; actions?: ToastAction[] };

type NotifyOptions = {
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. `0` keeps the toast until acted on or dismissed. */
  duration?: number;
  /** Buttons rendered in the toast (e.g. a permission prompt). Actionable toasts persist by default. */
  actions?: ToastAction[];
};

type NotificationsValue = { notify: (message: string, options?: NotifyOptions) => void };

const NotificationsContext = createContext<NotificationsValue | null>(null);

const MAX_VISIBLE = 4;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message: string, options?: NotifyOptions) => {
      const id = (idRef.current += 1);
      const tone = options?.tone ?? "info";
      const actions = options?.actions;
      setToasts((list) => [...list, { id, message, tone, actions }].slice(-MAX_VISIBLE));
      // Actionable toasts wait for a decision unless an explicit duration is given.
      const duration = options?.duration ?? (actions && actions.length > 0 ? 0 : 3600);
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const value = useMemo<NotificationsValue>(() => ({ notify }), [notify]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <NotificationHost toasts={toasts} onDismiss={dismiss} />
    </NotificationsContext.Provider>
  );
}

const TONE_RING: Record<ToastTone, string> = {
  info: "border-border/70 ring-primary/10",
  success: "border-primary/45 ring-primary/25",
  warn: "border-gold/45 ring-gold/25",
};

const TONE_DOT: Record<ToastTone, string> = {
  info: "bg-primary",
  success: "bg-primary",
  warn: "bg-gold",
};

function NotificationHost({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute right-3 top-12 z-[9500] flex w-72 max-w-[calc(100vw-1.5rem)] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => {
        const dot = (
          <span
            className={`mt-1 size-2 shrink-0 rounded-full ${TONE_DOT[toast.tone]}`}
            aria-hidden="true"
          />
        );
        const message = (
          <span className="font-mono text-[0.68rem] leading-5 tracking-[0.01em] text-foreground">
            {toast.message}
          </span>
        );

        if (toast.actions && toast.actions.length > 0) {
          return (
            <div
              key={toast.id}
              role="group"
              aria-label={toast.message}
              className={`os-toast-in pointer-events-auto flex flex-col gap-2.5 rounded-xl border bg-card/95 px-3.5 py-2.5 shadow-2xl ring-1 backdrop-blur-md ${TONE_RING[toast.tone]}`}
            >
              <div className="flex items-start gap-2.5">
                {dot}
                {message}
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  aria-label="Dismiss"
                  className="-mr-1 -mt-0.5 ml-auto grid size-5 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  ✕
                </button>
              </div>
              <div className="flex justify-end gap-2">
                {toast.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      onDismiss(toast.id);
                      action.onSelect();
                    }}
                    className="rounded-md border border-primary/45 bg-primary/12 px-2.5 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-primary hover:bg-primary/20 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        return (
          <button
            key={toast.id}
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label={`Dismiss notification: ${toast.message}`}
            className={`os-toast-in pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-card/95 px-3.5 py-2.5 text-left shadow-2xl ring-1 backdrop-blur-md transition hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${TONE_RING[toast.tone]}`}
          >
            {dot}
            {message}
          </button>
        );
      })}
    </div>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}
