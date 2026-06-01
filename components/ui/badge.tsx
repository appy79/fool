import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center px-3 py-1 text-xs font-semibold transition", {
  variants: {
    variant: {
      default: "border border-border/70 bg-card text-primary dark:bg-background dark:text-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-border/70 bg-card text-muted-foreground dark:bg-background"
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
