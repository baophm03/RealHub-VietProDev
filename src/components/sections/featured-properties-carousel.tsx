"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Property } from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import { formatPriceWithTransaction as formatPrice } from "@/utils";
import { MapPin, Square, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const statusBadgeMap: Record<string, { className: string; label: string }> = {
  AVAILABLE: { className: "bg-accent-green text-accent-green-text", label: "Sẵn có" },
  RESERVED: { className: "bg-accent-yellow text-accent-yellow-text", label: "Đặt cọc" },
  SOLD: { className: "bg-accent-red text-accent-red-text", label: "Đã bán" },
  RENTED: { className: "bg-accent-blue text-accent-blue-text", label: "Đã thuê" },
  OFF_MARKET: { className: "bg-secondary text-secondary-foreground", label: "Ngừng bán" },
};

const badgeBase =
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap";

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
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={20}
        loop={properties.length > 4}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        navigation
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

          return (
            <SwiperSlide key={prop.id} className="!h-auto">
              <Link
                href={`/listings/${prop.id}`}
                className="group/property relative flex h-full flex-col overflow-hidden rounded-[1.25rem] ring-1 ring-black/5"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={prop.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                    </div>
                  )}
                  {/* Badge */}
                  {badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className={cn(badgeBase, badge.className)}>{badge.label}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin size={12} />
                    {location || "Đang cập nhật"}
                  </div>
                  <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-tight">
                    {prop.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-4 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1.5">
                      <Square size={14} /> {prop.area ? `${prop.area}m²` : "--"}
                    </span>
                    {prop.propertyType?.name && (
                      <span className="flex items-center gap-1.5">
                        {prop.propertyType.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="rounded-full bg-primary/8 px-3 py-1 text-sm font-semibold text-primary">
                      {formatPrice(prop.price, prop.transactionType)}
                    </span>
                    <span className="flex size-8 translate-y-1 items-center justify-center rounded-full bg-primary-foreground text-primary opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:translate-y-0 group-hover/property:opacity-100">
                      <ArrowUpRight size={14} />
                    </span>
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
