/**
 * Empty state for cart, search, filters, and track order.
 */

import { Button } from "./Button";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
      role="status"
    >
      <h3 className="font-heading text-xl font-semibold text-brand-black md:text-2xl">
        {title}
      </h3>
      {description && (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-gray-500">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <div className="mt-8">
          <Button href={actionHref} variant="outline" size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
