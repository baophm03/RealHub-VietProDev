"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const locales = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

export interface HeaderTopStripProps {
  scrolled: boolean;
}

export function HeaderTopStrip({ scrolled }: HeaderTopStripProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      className={cn(
        "hidden overflow-hidden bg-primary transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:block",
        scrolled
          ? "max-h-0 py-0 opacity-0 border-transparent"
          : "max-h-12 opacity-100 border-b border-primary-foreground/10"
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-2 lg:px-12">
        <div className="flex items-center gap-6 text-xs text-primary-foreground/60">
          <span className="flex items-center gap-1.5">
            <Phone size={12} />
            <span className="font-mono tabular-nums">1900 1234</span>
          </span>
          <span className="h-3 w-px bg-primary-foreground/15" />
          <span className="max-w-[60ch] truncate">
            Nền tảng bất động sản chuyên nghiệp hàng đầu Việt Nam.
          </span>
        </div>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/60 transition-colors hover:text-primary-foreground"
          >
            <Globe size={12} />
            <span>VI</span>
            <ChevronDown
              size={10}
              className={cn("transition-transform duration-300", open && "rotate-180")}
            />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  className="flex w-full items-center px-3 py-2 text-left text-sm text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  {locale.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
