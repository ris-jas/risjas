import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "accent";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
          variant === "default" && "border-navy bg-navy text-white hover:bg-navy-soft",
          variant === "secondary" && "border-slate-100 bg-slate-50 text-slate-900 hover:bg-slate-100",
          variant === "outline" && "border-rose bg-transparent text-navy hover:bg-rose-soft",
          variant === "accent" && "border-rose bg-rose-soft text-rose-foreground hover:bg-rose",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
