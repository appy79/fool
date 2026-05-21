"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HeaderProps = React.HTMLAttributes<HTMLElement>;

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 flex w-full items-center border-b border-border/70 bg-card/75 px-6 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:bg-background/60 dark:shadow-slate-950/10",
        className
      )}
      {...props}
    />
  );
}

function HeaderBrand({ className, ...props }: HeaderProps) {
  return <div className={cn("flex items-center gap-3", className)} {...props} />;
}

function HeaderNav({ className, children, ...props }: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  const childrenArray = React.Children.toArray(children);
  const navChild = childrenArray.find(
    (child): child is React.ReactElement<React.HTMLAttributes<HTMLElement>, "nav"> =>
      React.isValidElement(child) && child.type === "nav"
  );
  const otherChildren = childrenArray.filter(
    (child) => !React.isValidElement(child) || child.type !== "nav"
  );

  const mobileLinks = navChild ? React.Children.toArray(navChild.props.children) : [];

  return (
    <div className={cn("relative ml-auto flex items-center gap-3", className)} {...props}>
      <div className="hidden md:flex items-center gap-3">
        {navChild}
        {otherChildren}
      </div>

      <div className="flex items-center gap-3 md:hidden">
        {otherChildren}
        <Button
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </Button>
      </div>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-screen max-w-xs rounded-3xl border border-border/70 bg-card/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:bg-background/95 dark:shadow-slate-950/10 md:hidden">
          <nav className="flex flex-col gap-2">
            {mobileLinks.map((child, index) =>
              React.isValidElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>(child) ? (
                React.cloneElement(child, {
                  key: child.key ?? index,
                  className: cn(
                    "block rounded-3xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    child.props.className
                  ),
                  onClick: () => setOpen(false),
                })
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
