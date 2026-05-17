import * as React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 flex items-center gap-4 border-border border-b bg-background/70 px-6 py-4 backdrop-blur-xl shadow-sm shadow-slate-950/10",
        className
      )}
      {...props}
    />
  );
}

function HeaderBrand({ className, ...props }: HeaderProps) {
  return <div className={cn("flex items-center gap-3", className)} {...props} />;
}

function HeaderNav({ className, ...props }: HeaderProps) {
  return <div className={cn("ml-auto flex items-center gap-3", className)} {...props} />;
}

export { Header, HeaderBrand, HeaderNav };
