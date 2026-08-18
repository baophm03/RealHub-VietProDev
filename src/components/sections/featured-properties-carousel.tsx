"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Property } from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import { formatPriceWithTransaction as formatPrice } from "@/utils";
import { MapPin, Square, BedDouble, Bath, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

const statusBadgeMap: Record<string, { className: string; label: string }> = {
  AVAILABLE: { className: "bg-accent-green text-accent-green-text", label: "Sẵn có" },
  RESERVED: { className: "bg-accent-yellow text-accent-yellow-text", label: "Đặt cọc" },
  SOLD: { className: "bg-accent-red text-accent-red-text", label: "Đã bán" },
  RENTED: { className: "bg-accent-blue text-accent-blue-text", label: "Đã thuê" },
  OFF_MARKET: { className: "bg-surface-muted text-foreground-muted", label: "Ngừng bán" },
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

// Shared badge style — đồng bộ với listings-view.tsx
const badgeBase =
  "inline-flex h-6 min-w-[3.25rem] items-center justify-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm whitespace-nowrap";

const BEDROOM_KEYS = ["bed_room_count", "bedroom_count", "bedrooms", "beds", "phong_ngu"];
const BATHROOM_KEYS = ["bathroom_count", "bathrooms", "baths", "pathroom_count", "phong_tam"];

function pickDynamicValue(
  dynamicValues: Record<string, unknown> | null | undefined,
  keys: string[],
): string | null {
  if (!dynamicValues) return null;
  for (const k of keys) {
    const v = dynamicValues[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return null;
}

interface FeaturedPropertiesCarouselProps {
  properties: Property[];
  imageMap: Map<string, string | null>;
}

export function FeaturedPropertiesCarousel({
  properties,
  imageMap,
}: FeaturedPropertiesCarouselProps) {
  if (properties.length === 0) return null;

  return (
    <div className="featured-properties-carousel relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        loop={properties.length > 4}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="!pb-12"
      >
        {properties.map((prop) => {
          const badge = statusBadgeMap[prop.businessStatus ?? ""];
          const location = [prop?.district?.name, prop?.province?.name]
            .filter(Boolean)
            .join(", ");
          const imageUrl = imageMap.get(prop.id) ?? null;
          const dynamicValues = (prop as any)?.dynamicValuesJson as
            | Record<string, unknown>
            | undefined;
          const bedrooms =
            prop.bedrooms != null
              ? String(prop.bedrooms)
              : pickDynamicValue(dynamicValues, BEDROOM_KEYS);
          const bathrooms =
            prop.bathrooms != null
              ? String(prop.bathrooms)
              : pickDynamicValue(dynamicValues, BATHROOM_KEYS);

          return (
            <SwiperSlide key={prop.id} className="!h-auto">
              <Link
                href={`/listings/${prop.id}`}
                className="group/property flex h-full flex-col bg-surface rounded-xl border border-border overflow-hidden hover:border-primary transition-colors shadow-sm hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-surface-muted">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={prop.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/property:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                    </div>
                  )}
                  {/* Status badge — top right */}
                  {badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className={cn(badgeBase, badge.className)}>{badge.label}</span>
                    </div>
                  )}
                  {/* Transaction badge — top left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={cn(
                        badgeBase,
                        prop.transactionType === "SALE"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent-blue text-accent-blue-text",
                      )}
                    >
                      {txLabel[prop.transactionType] ?? prop.transactionType}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-medium text-primary truncate pr-2 group-hover/property:text-primary/80 transition-colors">
                      {prop.title}
                    </h3>
                  </div>

                  <p className="text-sm text-foreground-muted flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{location || "Đang cập nhật"}</span>
                  </p>

                  {prop.propertyType?.name && (
                    <div className="flex gap-2 mt-1">
                      <span className="bg-surface-muted text-xs px-2 py-1 rounded text-foreground-muted">
                        {prop.propertyType.name}
                      </span>
                    </div>
                  )}

                  {/* Giá tiền */}
                  <div className="flex flex-col items-start justify-start gap-1 mt-1">
                    <div className="font-serif text-2xl font-bold text-primary">
                      {formatPrice(prop.price, prop.transactionType)}
                    </div>
                  </div>

                  {/* Thông tin phòng ngủ, phòng tắm, diện tích */}
                  <div className="flex flex-wrap items-center justify-start gap-3 mt-auto pt-4 border-t border-border text-xs text-foreground-muted">
                    {bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble size={13} className="shrink-0" />
                        <span className="tabular-nums">{bedrooms}</span>
                        <span>PN</span>
                      </span>
                    )}
                    {bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath size={13} className="shrink-0" />
                        <span className="tabular-nums">{bathrooms}</span>
                        <span>WC</span>
                      </span>
                    )}
                    {prop.area != null && (
                      <span className="flex items-center gap-1">
                        <Square size={13} className="shrink-0" />
                        <span className="tabular-nums">
                          {prop.area.toLocaleString("vi-VN")}
                        </span>
                        <span>m²</span>
                      </span>
                    )}
                  </div>

                  {/* Xem chi tiết */}
                  <div className="flex items-center gap-1 pt-2 text-xs font-medium text-primary">
                    Xem chi tiết
                    <ArrowRight size={13} className="shrink-0" />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
