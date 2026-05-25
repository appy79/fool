"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HeaderProps = React.HTMLAttributes<HTMLElement>;
type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: unknown;
};

const isNavLinkElement = (child: React.ReactNode): child is React.ReactElement<NavLinkProps> =>
  React.isValidElement<NavLinkProps>(child) && "href" in child.props;

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "glass sticky top-0 z-50 flex w-full items-center gap-3 border-b border-border/70 bg-card/75 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:px-6 dark:bg-background/60 dark:shadow-slate-950/10",
        className
      )}
      {...props}
    />
  );
}

function HeaderBrand({ className, ...props }: HeaderProps) {
  return <div className={cn("flex min-w-0 flex-1 items-center gap-3", className)} {...props} />;
}

function HeaderNav({ className, children, ...props }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const menuPanelRef = React.useRef<HTMLDivElement>(null);

  const childrenArray = React.Children.toArray(children);
  const navChild = childrenArray.find(
    (child): child is React.ReactElement<React.HTMLAttributes<HTMLElement>, "nav"> =>
      React.isValidElement(child) && child.type === "nav"
  );
  const otherChildren = childrenArray.filter(
    (child) => !React.isValidElement(child) || child.type !== "nav"
  );

  const mobileLinks = navChild ? React.Children.toArray(navChild.props.children) : [];

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const fallbackFocus = menuButtonRef.current;
    requestAnimationFrame(() => {
      menuPanelRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        menuPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        menuPanelRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        fallbackFocus?.focus();
      }
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative z-50 ml-auto flex shrink-0 items-center gap-3", className)} {...props}>
      <div className="hidden md:flex items-center gap-3">
        {navChild}
        {otherChildren}
      </div>

      <div className="relative z-50 flex items-center gap-3 md:hidden">
        {otherChildren}
        <Button
          ref={menuButtonRef}
          variant="ghost"
          size="icon"
          className="relative z-50 rounded-none border border-border/70 bg-card/40 hover:border-primary/60 hover:bg-primary/10"
          aria-controls={open ? menuId : undefined}
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </Button>
      </div>

      {open && (
        <div
          id={menuId}
          ref={menuPanelRef}
          tabIndex={-1}
          className="absolute right-0 top-full z-50 mt-3 w-screen max-w-xs border border-border/70 bg-card/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:hidden dark:bg-background/95 dark:shadow-slate-950/10"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {mobileLinks.map((child, index) =>
              isNavLinkElement(child) ? (
                React.cloneElement(child, {
                  key: child.key ?? index,
                  className: cn(
                    "block border border-transparent px-4 py-3 text-sm text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    child.props.className
                  ),
                  onClick: () => setOpen(false),
                })
              ) : React.isValidElement(child) ? (
                <React.Fragment key={child.key ?? index}>{child}</React.Fragment>
              ) : (
                child
              )
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export { Header, HeaderBrand, HeaderNav };
