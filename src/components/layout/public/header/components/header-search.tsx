"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

const popularTerms = [
  "Căn hộ Quận 1",
  "Biệt thự Thủ Đức",
  "Đất nền Bình Dương",
  "Nhà phố Tân Bình",
];

export function HeaderSearch() {
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
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex size-9 items-center justify-center rounded-lg text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
        aria-label="Search"
      >
        <Search size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border bg-surface shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search size={18} className="text-foreground-muted" />
            <input
              autoFocus
              type="text"
              placeholder="Tìm kiếm bất động sản..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none"
            />
            <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted">
              ESC
            </kbd>
          </div>
          <div className="px-4 py-3">
            <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
              Tìm kiếm phổ biến
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularTerms.map((term) => (
                <button
                  key={term}
                  className="rounded-lg bg-surface-muted px-2.5 py-1.5 text-xs text-foreground-muted transition-colors hover:bg-border/40 hover:text-foreground"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
