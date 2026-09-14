"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Check, ChevronDown } from "lucide-react";

const localeLabels: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

const localeShort: Record<string, string> = {
  vi: "VI",
  en: "EN",
};

function FlagIcon({ locale, className }: { locale: string; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[2px] ${className ?? ""}`}>
      {locale === "vi" ? (
        <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none">
          <rect width="30" height="20" fill="#DA251D" />
          <polygon
            points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"
            fill="#FFFF00"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none">
          <rect width="30" height="20" fill="#012169" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2" />
          <path d="M15,0 v20 M0,10 h30" stroke="#fff" strokeWidth="6" />
          <path d="M15,0 v20 M0,10 h30" stroke="#C8102E" strokeWidth="4" />
        </svg>
      )}
    </span>
  );
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#092909] transition-colors hover:bg-[#092909]/10"
        aria-label="Change language"
      >
        <FlagIcon locale={locale} className="h-[14px] w-[20px]" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {localeShort[locale] ?? locale}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[170px] overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#092909]/5"
            >
              <FlagIcon locale={l} className="h-[14px] w-[20px]" />
              <span className={`flex-1 text-left ${l === locale ? "font-semibold text-[#092909]" : "text-black/70"}`}>
                {localeLabels[l] ?? l}
              </span>
              {l === locale && <Check size={16} className="text-[#092909]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
