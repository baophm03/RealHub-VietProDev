"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { GridFour, MapTrifold as MapIcon } from "@phosphor-icons/react";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "area-desc", label: "Diện tích: Lớn nhất" },
];

export function ListingsToolbar({
  currentSort,
  resultCount,
}: {
  currentSort: string;
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
          Khám phá Bất động sản
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          {resultCount} kết quả phù hợp
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* View Toggle (decorative — map not implemented) */}
        <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-xl border border-border">
          <button className="px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-2 bg-surface text-primary shadow-sm">
            <GridFour size={14} /> Grid
          </button>
          <button className="px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-2 text-foreground-muted hover:bg-surface transition-colors">
            <MapIcon size={14} /> Map
          </button>
        </div>
        {/* Sort */}
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
