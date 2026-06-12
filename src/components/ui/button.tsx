"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm tracking-wide transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verse-gold-soft focus-visible:ring-offset-2 focus-visible:ring-offset-verse-void disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-verse-cream text-verse-void hover:bg-verse-cream/90 shadow-verse-soft",
        ghost:
          "bg-transparent text-verse-cream-muted hover:text-verse-cream hover:bg-verse-surface/60",
        outline:
          "border border-verse-border bg-transparent text-verse-cream hover:border-verse-gold-soft/40 hover:bg-verse-surface/40",
        gold: "bg-verse-gold/90 text-verse-void hover:bg-verse-gold",
      },
      size: {
        sm: "h-9 px-4 rounded-full",
        md: "h-11 px-6 rounded-full",
        lg: "h-13 px-8 rounded-full text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
