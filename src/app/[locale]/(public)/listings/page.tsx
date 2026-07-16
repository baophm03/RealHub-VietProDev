"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  mockProperties, mockPropertyTypes, mockZones, mockLegalStatuses,
  mockDirections, mockHotAreas, formatPricePerSqm,
} from "@/lib/mock/properties";
import {
  MapPin, Camera, SealCheck, GridFour, MapTrifold as MapIcon,
  Bell, ArrowRight, Clock,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "area-desc", label: "Diện tích: Lớn nhất" },
];

const BEDROOM_OPTIONS = ["1", "2", "3", "4+"];

export default function ListingsPage() {
  const [selectedZone, setSelectedZone] = useState(mockZones[0]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState("");
  const [legalStatus, setLegalStatus] = useState(mockLegalStatuses[0]);
  const [direction, setDirection] = useState(mockDirections[0]);
  const [transactionType, setTransactionType] = useState<"ALL" | "SALE" | "RENT">("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [activeArea, setActiveArea] = useState(0);

  const filtered = useMemo(() => {
    let result = mockProperties.filter((p) => {
      if (transactionType !== "ALL" && p.transactionType !== transactionType) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
      if (legalStatus !== mockLegalStatuses[0] && p.legalStatus !== legalStatus) return false;
      if (direction !== mockDirections[0] && p.direction !== direction) return false;
      if (bedrooms) {
        const minBeds = parseInt(bedrooms.replace("+", ""));
        if (p.bedrooms < minBeds) return false;
      }
      if (priceFrom) {
        const from = parseFloat(priceFrom) * (transactionType === "RENT" ? 1000000 : 1000000000);
        if (p.price < from) return false;
      }
      if (priceTo) {
        const to = parseFloat(priceTo) * (transactionType === "RENT" ? 1000000 : 1000000000);
        if (p.price > to) return false;
      }
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "area-desc":
        result = [...result].sort((a, b) => b.area - a.area);
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return result;
  }, [transactionType, selectedTypes, legalStatus, direction, bedrooms, priceFrom, priceTo, sortBy]);

  const hasFilters =
    selectedTypes.length > 0 ||
    legalStatus !== mockLegalStatuses[0] ||
    direction !== mockDirections[0] ||
    bedrooms !== "" ||
    transactionType !== "ALL" ||
    priceFrom !== "" ||
    priceTo !== "";

  const clearFilters = () => {
    setSelectedTypes([]);
    setLegalStatus(mockLegalStatuses[0]);
    setDirection(mockDirections[0]);
    setBedrooms("");
    setTransactionType("ALL");
    setPriceFrom("");
    setPriceTo("");
  };

  const toggleType = (type: string) => {
    if (type === "Tất cả") return;
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-8">
      <div className="flex flex-1 gap-6 flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-4 lg:sticky lg:top-24">
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
                    onClick={() => setTransactionType(t)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      transactionType === t ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground-muted hover:bg-border/40"
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
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {mockZones.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                Mức giá {transactionType === "RENT" ? "(triệu)" : "(tỷ)"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="Từ"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-foreground-muted">—</span>
                <input
                  type="text" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="Đến"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Loại hình</label>
              <div className="flex flex-col gap-2">
                {mockPropertyTypes.filter((t) => t !== "Tất cả").map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Số phòng ngủ</label>
              <div className="flex flex-wrap gap-2">
                {BEDROOM_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(bedrooms === b ? "" : b)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      bedrooms === b
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border border-border text-foreground-muted hover:bg-surface-muted"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Status */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Pháp lý</label>
              <select
                value={legalStatus}
                onChange={(e) => setLegalStatus(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {mockLegalStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Direction */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Hướng nhà</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {mockDirections.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <Button className="w-full" size="lg">Áp dụng bộ lọc</Button>
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
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-2 transition-colors ${
                    viewMode === "grid" ? "bg-surface text-primary shadow-sm" : "text-foreground-muted hover:bg-surface"
                  }`}
                >
                  <GridFour size={14} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-2 transition-colors ${
                    viewMode === "map" ? "bg-surface text-primary shadow-sm" : "text-foreground-muted hover:bg-surface"
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

          {/* Hot Areas */}
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-xl font-medium text-primary">Khu vực nổi bật</h3>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {mockHotAreas.map((area, i) => (
                <button
                  key={area.label}
                  onClick={() => setActiveArea(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
                    activeArea === i
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "bg-surface-muted border border-border text-foreground-muted hover:bg-surface"
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((property, i) => (
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
                      style={{ backgroundImage: `url(${property.image})` }}
                    />
                    {/* Badge top-right */}
                    {property.badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm ${
                          property.badge === "Premium"
                            ? "bg-accent-yellow text-accent-yellow-text"
                            : "bg-accent-blue text-accent-blue-text"
                        }`}>
                          {property.badge}
                        </span>
                      </div>
                    )}
                    {/* Photo count top-left */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="flex items-center gap-1 bg-surface/90 backdrop-blur-sm text-primary text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                        <Camera size={14} /> {property.photoCount}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg font-medium text-primary truncate pr-2 group-hover:text-primary/80 transition-colors">
                        {property.title}
                      </h3>
                      {property.verified ? (
                        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide shrink-0" style={{ color: "#3b6934" }}>
                          <SealCheck size={14} weight="fill" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted shrink-0">
                          <Clock size={14} /> Đang giao dịch
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-foreground-muted flex items-center gap-1">
                      <MapPin size={16} weight="fill" /> {property.district}, {property.province}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-2 mt-1">
                      {property.tags.map((tag) => (
                        <span key={tag} className="bg-surface-muted text-xs px-2 py-1 rounded text-foreground-muted">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-border">
                      <div>
                        <div className="font-serif text-2xl font-bold text-primary">{property.priceText}</div>
                        <div className="text-xs text-foreground-muted">{formatPricePerSqm(property.price, property.area)}</div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mt-1">
                          {property.area}m²{property.bedrooms > 0 ? ` • ${property.bedrooms} PN` : ""} • Hướng {property.direction}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-base text-foreground-muted">Không tìm thấy BĐS phù hợp bộ lọc.</p>
              <button onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex justify-center mt-4 gap-2">
              <button className="p-2 rounded border border-border text-foreground-muted hover:bg-surface-muted">
                <ArrowRight size={16} className="rotate-180" />
              </button>
              <button className="px-4 py-2 rounded bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide">1</button>
              <button className="px-4 py-2 rounded border border-border text-foreground-muted hover:bg-surface-muted text-xs font-semibold uppercase tracking-wide">2</button>
              <button className="px-4 py-2 rounded border border-border text-foreground-muted hover:bg-surface-muted text-xs font-semibold uppercase tracking-wide">3</button>
              <span className="px-2 py-2 text-foreground-muted">...</span>
              <button className="px-4 py-2 rounded border border-border text-foreground-muted hover:bg-surface-muted text-xs font-semibold uppercase tracking-wide">12</button>
              <button className="p-2 rounded border border-border text-foreground-muted hover:bg-surface-muted">
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
