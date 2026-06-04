"use client";

import {
  createContext,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type MenuItem =
  | {
      label: string;
      onSelect: () => void;
      disabled?: boolean;
      danger?: boolean;
      separatorBefore?: boolean;
    }
  | { separator: true };

type OpenAt = { x: number; y: number; items: MenuItem[] };

type ContextMenuValue = {
  /** Open a menu at the cursor for a right-click event. */
  openMenu: (event: ReactMouseEvent, items: MenuItem[]) => void;
};

const ContextMenuContext = createContext<ContextMenuValue | null>(null);

const MENU_W = 208;
const MENU_PAD = 8;

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<OpenAt | null>(null);

  const openMenu = useCallback((event: ReactMouseEvent, items: MenuItem[]) => {
    if (items.length === 0) return;
    event.preventDefault();
    event.stopPropagation();
    setMenu({ x: event.clientX, y: event.clientY, items });
  }, []);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onPointerDown = () => close();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    };
    const onBlur = () => close();
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onBlur);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onBlur);
      window.removeEventListener("blur", onBlur);
    };
  }, [menu, close]);

  const value = useMemo<ContextMenuValue>(() => ({ openMenu }), [openMenu]);

  // Flip the menu back on-screen when opened near the right/bottom edges.
  const left =
    menu && typeof window !== "undefined"
      ? Math.min(menu.x, window.innerWidth - MENU_W - MENU_PAD)
      : (menu?.x ?? 0);
  const top = menu?.y ?? 0;

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      {menu ? (
        <div
          role="menu"
          aria-label="Context menu"
          className="os-window-in fixed z-[9600] w-52 overflow-hidden rounded-xl border border-border/70 bg-card/95 p-1 shadow-2xl ring-1 ring-primary/10 backdrop-blur-md dark:ring-primary/20"
          style={{ left, top, maxWidth: MENU_W }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {menu.items.map((item, index) => {
            if ("separator" in item) {
              return (
                <div key={`sep-${index}`} role="separator" className="my-1 h-px bg-border/60" />
              );
            }
            return (
              <div key={item.label}>
                {item.separatorBefore ? (
                  <div role="separator" className="my-1 h-px bg-border/60" />
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  className={`flex w-full items-center rounded-lg px-3 py-1.5 text-left text-[0.78rem] transition focus-visible:outline-none disabled:cursor-not-allowed disabled:text-muted-foreground/40 disabled:hover:bg-transparent ${
                    item.danger
                      ? "text-destructive hover:bg-destructive/12 focus-visible:bg-destructive/12"
                      : "text-foreground hover:bg-primary/15 focus-visible:bg-primary/15"
                  }`}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return ctx;
}
