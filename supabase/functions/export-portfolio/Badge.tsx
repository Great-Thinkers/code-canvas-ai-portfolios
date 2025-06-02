import React from "https://esm.sh/react@18.2.0";
import { cn } from "./utils.ts"; // Adjusted path

// Simplified badgeVariants logic, manually defining classes for used variants
const badgeClasses = {
  variant: {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground", // Used by ModernMinimalTemplate
  },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeClasses.variant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClass = badgeClasses.variant[variant] || badgeClasses.variant.default;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClass,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
