import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-lg bg-surface-muted text-foreground-muted">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-foreground-muted max-w-[40ch]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
