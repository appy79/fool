import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function Card({ className, ...props }: CardProps) {
  return <div className={cn("glass rounded-3xl border border-border/70 bg-card/75 text-card-foreground shadow-sm shadow-slate-900/5 dark:bg-background/60 dark:shadow-slate-950/10", className)} {...props} />;
}

function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("mt-4", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
