import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  danger:
    "border border-red-300/20 bg-red-300/10 text-red-100 hover:bg-red-300/15 hover:shadow-red-950/20",
  ghost:
    "border border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/15 hover:bg-white/[0.075] hover:text-zinc-100",
  primary:
    "bg-sky-400 text-zinc-950 shadow-lg shadow-sky-950/30 hover:bg-sky-300 hover:shadow-sky-950/45",
  secondary:
    "border border-sky-300/20 bg-sky-300/10 text-sky-100 hover:border-sky-300/30 hover:bg-sky-300/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "px-5 py-3 text-sm",
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-2 text-xs",
};

export function Button({
  children,
  className,
  isLoading = false,
  size = "md",
  variant = "ghost",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
