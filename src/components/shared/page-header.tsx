import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-foreground-muted text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
