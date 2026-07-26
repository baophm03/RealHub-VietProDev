"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin, SealCheck, GridFour, MapTrifold as MapIcon,
  Bell, Spinner,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useGetApiProperties, useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import { useGetApiLocations } from "@/lib/api/endpoints/locations";
import { GetPropertiesResponse } from "@/lib/api/types/properties";
import type { Location } from "@/lib/api/types/locations";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "area-desc", label: "Diện tích: Lớn nhất" },
];

const statusBadge: Record<string, { label: string; class: string }> = {
  AVAILABLE: { label: "Sẵn có", class: "bg-accent-green text-accent-green-text" },
  RESERVED: { label: "Đặt cọc", class: "bg-accent-yellow text-accent-yellow-text" },
  SOLD: { label: "Đã bán", class: "bg-accent-red text-accent-red-text" },
  RENTED: { label: "Đã thuê", class: "bg-accent-blue text-accent-blue-text" },
  OFF_MARKET: { label: "Ngừng bán", class: "bg-surface-muted text-foreground-muted" },
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

function formatPrice(priceStr: string, transactionType: string): string {
  const price = Number(priceStr || 0);
  if (transactionType === "RENT") {
    if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu/tháng`;
    return `${price.toLocaleString("vi-VN")} đ/tháng`;
  }
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu`;
  return `${price.toLocaleString("vi-VN")} đ`;
}

function formatPricePerSqm(priceStr: string, area: number): string {
  const price = Number(priceStr || 0);
  if (!area || area <= 0) return "";
  const perSqm = Math.round(price / area);
  if (perSqm >= 1000000) return `~${(perSqm / 1000000).toFixed(1)} tr/m²`;
  return `~${perSqm.toLocaleString("vi-VN")} đ/m²`;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

export default function ListingsPage() {
  // Draft filter state (what the user selects in the UI)
  const [draftPriceFrom, setDraftPriceFrom] = useState("");
  const [draftPriceTo, setDraftPriceTo] = useState("");
  const [draftSelectedTypes, setDraftSelectedTypes] = useState<string[]>([]);
  const [draftTransactionType, setDraftTransactionType] = useState<"ALL" | "SALE" | "RENT">("ALL");
  const [draftSelectedZone, setDraftSelectedZone] = useState("");

  // Applied filter state (what's actually sent to the API)
  const [appliedPriceFrom, setAppliedPriceFrom] = useState("");
  const [appliedPriceTo, setAppliedPriceTo] = useState("");
  const [appliedSelectedTypes, setAppliedSelectedTypes] = useState<string[]>([]);
  const [appliedTransactionType, setAppliedTransactionType] = useState<"ALL" | "SALE" | "RENT">("ALL");
  const [appliedSelectedZone, setAppliedSelectedZone] = useState("");

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Fetch property types from API
  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const propertyTypes = (propertyTypesData?.data as unknown as PropertyType[]) || [];

  // Fetch provinces from API
  const { data: provincesData } = useGetApiLocations({ type: "PROVINCE", limit: 100 });
  const provinces = (provincesData?.data as unknown as Location[]) || [];

  // Build API params from applied filters
  const apiParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (appliedTransactionType !== "ALL") params.transactionType = appliedTransactionType;
    if (appliedSelectedZone) params.provinceId = appliedSelectedZone;
    if (appliedSelectedTypes.length === 1) params.propertyTypeId = appliedSelectedTypes[0];
    if (appliedPriceFrom) {
      const multiplier = appliedTransactionType === "RENT" ? 1000000 : 1000000000;
      params.minPrice = String(parseFloat(appliedPriceFrom) * multiplier);
    }
    if (appliedPriceTo) {
      const multiplier = appliedTransactionType === "RENT" ? 1000000 : 1000000000;
      params.maxPrice = String(parseFloat(appliedPriceTo) * multiplier);
    }
    return params;
  }, [appliedTransactionType, appliedSelectedZone, appliedSelectedTypes, appliedPriceFrom, appliedPriceTo]);

  const { data: propertiesData, isLoading } = useGetApiProperties(apiParams as any);
  const properties = ((propertiesData as unknown as GetPropertiesResponse)?.data) || [];

  // Client-side filtering for property types (when multiple selected) + sorting
  const filtered = useMemo(() => {
    let result = properties;
    if (appliedSelectedTypes.length > 1) {
      result = result.filter(
        (p) => p.propertyType && appliedSelectedTypes.includes(p.propertyType.id)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-desc":
        result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "area-desc":
        result = [...result].sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return result;
  }, [properties, appliedSelectedTypes, sortBy]);

  const hasFilters =
    appliedSelectedTypes.length > 0 ||
    appliedTransactionType !== "ALL" ||
    appliedPriceFrom !== "" ||
    appliedPriceTo !== "" ||
    appliedSelectedZone !== "";

  const clearFilters = () => {
    setDraftSelectedTypes([]);
    setDraftTransactionType("ALL");
    setDraftPriceFrom("");
    setDraftPriceTo("");
    setDraftSelectedZone("");
    setAppliedSelectedTypes([]);
    setAppliedTransactionType("ALL");
    setAppliedPriceFrom("");
    setAppliedPriceTo("");
    setAppliedSelectedZone("");
  };

  const toggleType = (typeId: string) => {
    setDraftSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const applyFilters = () => {
    setAppliedPriceFrom(draftPriceFrom);
    setAppliedPriceTo(draftPriceTo);
    setAppliedSelectedTypes(draftSelectedTypes);
    setAppliedTransactionType(draftTransactionType);
    setAppliedSelectedZone(draftSelectedZone);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-8">
      <div className="flex flex-1 gap-6 flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-medium text-primary">Bộ lọc tìm kiếm</h2>
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
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${draftTransactionType === t ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground-muted hover:bg-border/40"
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
                {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                Mức giá {draftTransactionType === "RENT" ? "(triệu)" : "(tỷ)"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text" value={draftPriceFrom} onChange={(e) => setDraftPriceFrom(e.target.value)} placeholder="Từ"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-foreground-muted">—</span>
                <input
                  type="text" value={draftPriceTo} onChange={(e) => setDraftPriceTo(e.target.value)} placeholder="Đến"
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
                      type="checkbox" checked={draftSelectedTypes.includes(t.id)} onChange={() => toggleType(t.id)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={applyFilters}>Áp dụng bộ lọc</Button>
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">Khám phá Bất động sản</h1>
              <p className="text-sm text-foreground-muted mt-1">
                {filtered.length} kết quả phù hợp • Cập nhật 5 phút trước
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-xl border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-2 transition-colors ${viewMode === "grid" ? "bg-surface text-primary shadow-sm" : "text-foreground-muted hover:bg-surface"
                    }`}
                >
                  <GridFour size={14} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-2 transition-colors ${viewMode === "map" ? "bg-surface text-primary shadow-sm" : "text-foreground-muted hover:bg-surface"
                    }`}
                >
                  <MapIcon size={14} /> Map
                </button>
              </div>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Spinner size={32} className="animate-spin text-primary" />
            </div>
          )}

          {/* Property Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((property, i) => {
                const badge = statusBadge[property.businessStatus ?? ""];
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/listings/${property.id}`}
                      className="group flex flex-col bg-surface rounded-xl border border-border overflow-hidden hover:border-primary transition-colors shadow-sm hover:shadow-md"
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}
                        />
                        {/* Status badge top-right */}
                        {badge && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm ${badge.class}`}>
                              {badge.label}
                            </span>
                          </div>
                        )}
                        {/* Transaction type top-left */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="flex items-center gap-1 bg-surface/90 backdrop-blur-sm text-primary text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                            {txLabel[property.transactionType] ?? property.transactionType}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg font-medium text-primary truncate pr-2 group-hover:text-primary/80 transition-colors">
                            {property.title}
                          </h3>
                        </div>

                        <p className="text-sm text-foreground-muted flex items-center gap-1">
                          <MapPin size={16} weight="fill" /> {property.address ?? "Đang cập nhật"}
                        </p>

                        {/* Property type tag */}
                        {property.propertyType?.name && (
                          <div className="flex gap-2 mt-1">
                            <span className="bg-surface-muted text-xs px-2 py-1 rounded text-foreground-muted">
                              {property.propertyType.name}
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex justify-between items-end mt-auto pt-4 border-t border-border">
                          <div>
                            <div className="font-serif text-2xl font-bold text-primary">
                              {formatPrice(property.price, property.transactionType)}
                            </div>
                            <div className="text-xs text-foreground-muted">
                              {formatPricePerSqm(property.price, property.area)}
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mt-1">
                              {property.area ? `${property.area}m²` : "Đang cập nhật"}
                              {property.propertyType?.name ? ` • ${property.propertyType.name}` : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-base text-foreground-muted">Không tìm thấy BĐS phù hợp bộ lọc.</p>
              <button onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
