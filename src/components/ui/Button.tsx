/**
 * Primary button primitive — black / outline / gold / ghost variants.
 */

import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  fullWidth?: boolean;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-black text-white hover:bg-brand-black-soft border border-transparent",
  secondary:
    "bg-brand-cream text-brand-black hover:bg-brand-gray-100 border border-transparent",
  outline:
    "bg-transparent text-brand-black border border-brand-black hover:bg-brand-black hover:text-white",
  ghost: "bg-transparent text-brand-black hover:bg-brand-gray-100 border border-transparent",
  gold: "bg-brand-gold text-brand-black hover:bg-brand-gold-light border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-wide",
  md: "h-11 px-6 text-sm tracking-wide",
  lg: "h-13 px-8 text-sm tracking-widest uppercase",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      fullWidth,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className
    );

    if (href && !disabled) {
      const { onClick, ...rest } = props;
      return (
        <Link
          href={href}
          className={classes}
          aria-disabled={loading}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          {...(rest as Record<string, unknown>)}
        >
          {loading ? <span className="opacity-70">Please wait…</span> : children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <span className="opacity-70">Please wait…</span> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
