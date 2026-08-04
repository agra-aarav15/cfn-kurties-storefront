/**
 * Responsive page container with consistent horizontal padding.
 */

import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
  narrow?: boolean;
}

export function Container({
  children,
  className,
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}
