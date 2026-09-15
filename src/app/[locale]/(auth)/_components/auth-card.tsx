import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Bọc nội dung form (đã có sẵn card padding) */
  bodyClassName?: string;
}

/**
 * Shared shell cho các trang auth (login / register / forgot-password / verify-otp).
 * Editorial luxury: serif heading, fine border, soft green-tinted shadow, backdrop blur.
 */
export function AuthCard({
  title,
  subtitle,
  children,
  className,
  bodyClassName,
}: AuthCardProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-[1.25rem] border border-border bg-surface/80 p-7 shadow-[0_24px_70px_-24px_rgba(45,95,63,0.14)] backdrop-blur-xl md:p-10">
        <header className="mb-7 md:mb-8">
          {title ? (
            <h2 className="font-serif text-[1.625rem] font-semibold leading-tight tracking-tight md:text-3xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
              {subtitle}
            </p>
          ) : null}
        </header>
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  );
}

export default AuthCard;
