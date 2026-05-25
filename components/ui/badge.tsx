import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center px-3 py-1 text-xs font-semibold transition", {
  variants: {
    variant: {
      default: "glass border border-border/70 bg-card/70 text-primary shadow-sm shadow-slate-900/5 dark:text-foreground dark:shadow-slate-950/10",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-border/70 bg-card/50 text-muted-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = "Badge";

export { Badge };
