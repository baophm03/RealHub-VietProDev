"use client";

import { useSearchParams } from "next/navigation";
import { MapPin, Spinner } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { useGetApiProperties, useGetApiPropertyTypes } from "@/lib/api/endpoints/properties";
import { useGetApiLocations } from "@/lib/api/endpoints/locations";
import { GetPropertiesResponse } from "@/lib/api/types/properties";
import type { Location } from "@/lib/api/types/locations";
import { ListingsFilter } from "./listings-filter";
import { ListingsToolbar } from "./listings-toolbar";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

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

export function ListingsView() {
  const sp = useSearchParams();

  const transactionType = sp.get("transactionType") ?? "";
  const provinceId = sp.get("provinceId") ?? "";
  const typesRaw = sp.get("types") ?? "";
  const types = typesRaw ? typesRaw.split(",").filter(Boolean) : [];
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";
  const sort = sp.get("sort") ?? "newest";

  const priceMultiplier = transactionType === "RENT" ? 1000000 : 1000000000;
  const currentPriceFrom = minPrice ? String(Number(minPrice) / priceMultiplier) : "";
  const currentPriceTo = maxPrice ? String(Number(maxPrice) / priceMultiplier) : "";

  const { data: propertyTypesData } = useGetApiPropertyTypes();
  const { data: provincesData } = useGetApiLocations({ type: "PROVINCE" as any, limit: 100 } as any);

  const propertyTypes = ((propertyTypesData as unknown as { data?: PropertyType[] })?.data) || [];
  const provinces = ((provincesData as unknown as { data?: Location[] })?.data) || [];

  // Build API params from searchParams
  const apiParams: Record<string, string> = {};
  if (transactionType) apiParams.transactionType = transactionType;
  if (provinceId) apiParams.provinceId = provinceId;
  if (types.length === 1) apiParams.propertyTypeId = types[0];
  if (minPrice) apiParams.minPrice = minPrice;
  if (maxPrice) apiParams.maxPrice = maxPrice;
  apiParams.limit = "100";

  const { data: propertiesData, isLoading } = useGetApiProperties(apiParams as any);
  let properties = ((propertiesData as unknown as GetPropertiesResponse)?.data) || [];

  // Client-side filtering for multiple property types
  if (types.length > 1) {
    properties = properties.filter(
      (p) => p.propertyType && types.includes(p.propertyType.id),
    );
  }

  // Client-side sorting
  switch (sort) {
    case "price-asc":
      properties = [...properties].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      break;
    case "price-desc":
      properties = [...properties].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      break;
    case "area-desc":
      properties = [...properties].sort((a, b) => (b.area || 0) - (a.area || 0));
      break;
    default:
      properties = [...properties].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} className="animate-spin text-foreground-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-8">
      <div className="flex flex-1 gap-6 flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <ListingsFilter
            propertyTypes={propertyTypes}
            provinces={provinces}
            currentTransactionType={transactionType}
            currentProvinceId={provinceId}
            currentTypes={types}
            currentPriceFrom={currentPriceFrom}
            currentPriceTo={currentPriceTo}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          <ListingsToolbar currentSort={sort} resultCount={properties.length} />

          {/* Property Grid */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-base text-foreground-muted">Không tìm thấy BĐS phù hợp bộ lọc.</p>
              <Link href="/listings" className="text-sm font-medium text-primary hover:underline">
                Xóa tất cả bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => {
                const badge = statusBadge[property.businessStatus ?? ""];
                return (
                  <Link
                    key={property.id}
                    href={`/listings/${property.id}`}
                    className="group flex flex-col bg-surface rounded-xl border border-border overflow-hidden hover:border-primary transition-colors shadow-sm hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}
                      />
                      {badge && (
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm ${badge.class}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      )}
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
                        <MapPin size={16} weight="fill" />
                        <span>
                          {property?.district?.name ?? "Đang cập nhật"},{" "}
                          {property?.province?.name ?? "Đang cập nhật"}
                        </span>
                      </p>

                      {property.propertyType?.name && (
                        <div className="flex gap-2 mt-1">
                          <span className="bg-surface-muted text-xs px-2 py-1 rounded text-foreground-muted">
                            {property.propertyType.name}
                          </span>
                        </div>
                      )}

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
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
