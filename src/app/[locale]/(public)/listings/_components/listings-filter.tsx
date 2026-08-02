"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bell, Funnel } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

type Province = {
  id: string;
  name: string;
};

interface ListingsFilterProps {
  propertyTypes: PropertyType[];
  provinces: Province[];
  // Current filter values from searchParams
  currentTransactionType: string;
  currentProvinceId: string;
  currentTypes: string[];
  currentPriceFrom: string;
  currentPriceTo: string;
}

export function ListingsFilter({
  propertyTypes,
  provinces,
  currentTransactionType,
  currentProvinceId,
  currentTypes,
  currentPriceFrom,
  currentPriceTo,
}: ListingsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Draft state initialized from current searchParams
  const [draftTransactionType, setDraftTransactionType] = useState<"ALL" | "SALE" | "RENT">(
    (currentTransactionType as "ALL" | "SALE" | "RENT") || "ALL",
  );
  const [draftSelectedZone, setDraftSelectedZone] = useState(currentProvinceId || "");
  const [draftSelectedTypes, setDraftSelectedTypes] = useState<string[]>(currentTypes || []);
  const [draftPriceFrom, setDraftPriceFrom] = useState(currentPriceFrom || "");
  const [draftPriceTo, setDraftPriceTo] = useState(currentPriceTo || "");

  const hasFilters =
    draftSelectedTypes.length > 0 ||
    draftTransactionType !== "ALL" ||
    draftPriceFrom !== "" ||
    draftPriceTo !== "" ||
    draftSelectedZone !== "";

  const toggleType = (typeId: string) => {
    setDraftSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId],
    );
  };

  const buildUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Preserve sort
    const sort = params.get("sort");

    params.delete("transactionType");
    params.delete("provinceId");
    params.delete("types");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sort");

    if (draftTransactionType !== "ALL") params.set("transactionType", draftTransactionType);
    if (draftSelectedZone) params.set("provinceId", draftSelectedZone);
    if (draftSelectedTypes.length > 0) params.set("types", draftSelectedTypes.join(","));
    if (draftPriceFrom) {
      const multiplier = draftTransactionType === "RENT" ? 1000000 : 1000000000;
      params.set("minPrice", String(parseFloat(draftPriceFrom) * multiplier));
    }
    if (draftPriceTo) {
      const multiplier = draftTransactionType === "RENT" ? 1000000 : 1000000000;
      params.set("maxPrice", String(parseFloat(draftPriceTo) * multiplier));
    }
    if (sort) params.set("sort", sort);

    return `${pathname}?${params.toString()}`;
  };

  const applyFilters = () => {
    router.push(buildUrl());
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const sort = params.get("sort");
    const cleanParams = new URLSearchParams();
    if (sort) cleanParams.set("sort", sort);
    const url = cleanParams.toString() ? `${pathname}?${cleanParams.toString()}` : pathname;
    router.push(url);
  };

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-xl font-medium text-primary flex items-center gap-2">
            <Funnel size={16} /> Bộ lọc tìm kiếm
          </h2>
          {hasFilters && (
            <button onClick={clearFilters} className="text-primary text-sm font-semibold hover:underline">
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Transaction Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Loại giao dịch</label>
          <div className="flex gap-2">
            {(["ALL", "SALE", "RENT"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDraftTransactionType(t)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  draftTransactionType === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-muted text-foreground-muted hover:bg-border/40"
                }`}
              >
                {t === "ALL" ? "Tất cả" : t === "SALE" ? "Bán" : "Cho thuê"}
              </button>
            ))}
          </div>
        </div>

        {/* Zone Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Khu vực</label>
          <select
            value={draftSelectedZone}
            onChange={(e) => setDraftSelectedZone(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Tất cả</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            Mức giá {draftTransactionType === "RENT" ? "(triệu)" : "(tỷ)"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draftPriceFrom}
              onChange={(e) => setDraftPriceFrom(e.target.value)}
              placeholder="Từ"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-foreground-muted">—</span>
            <input
              type="text"
              value={draftPriceTo}
              onChange={(e) => setDraftPriceTo(e.target.value)}
              placeholder="Đến"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Loại hình</label>
          <div className="flex flex-col gap-2">
            {propertyTypes.map((t) => (
              <label key={t.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftSelectedTypes.includes(t.id)}
                  onChange={() => toggleType(t.id)}
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={applyFilters}>
          Áp dụng bộ lọc
        </Button>
      </div>

      {/* Notification Card */}
      <div className="bg-primary rounded-xl p-4 flex flex-col gap-2 text-center items-center justify-center">
        <Bell size={32} className="text-primary-foreground mb-1" />
        <h3 className="font-serif text-lg font-medium text-primary-foreground">Tạo thông báo</h3>
        <p className="text-sm text-primary-foreground/80">
          Nhận thông báo khi có bất động sản mới phù hợp với tìm kiếm này.
        </p>
        <button className="w-full mt-2 py-2 bg-surface text-primary rounded-lg text-xs font-semibold uppercase tracking-wide hover:bg-surface-muted transition-colors">
          Đăng ký nhận tin
        </button>
      </div>
    </div>
  );
}
