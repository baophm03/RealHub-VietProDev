"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleSortChange = (value: string | null) => {
    if (!value) return;
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
        {/* Sort */}
        <Select value={currentSort} onValueChange={handleSortChange} items={SORT_OPTIONS}>
          <SelectTrigger className="w-[180px] rounded-lg border border-border bg-surface text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
