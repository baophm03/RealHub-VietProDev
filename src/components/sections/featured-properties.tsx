"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Square, ArrowUpRight, Spinner } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { useGetApiProperties } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse } from "@/lib/api/types/properties";

const statusBadgeMap: Record<string, { variant: "green" | "blue" | "yellow" | "red" | "secondary"; label: string }> = {
  AVAILABLE: { variant: "green", label: "Sẵn có" },
  RESERVED: { variant: "yellow", label: "Đặt cọc" },
  SOLD: { variant: "red", label: "Đã bán" },
  RENTED: { variant: "blue", label: "Đã thuê" },
  OFF_MARKET: { variant: "secondary", label: "Ngừng bán" },
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

const BENTO_SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "",
  "",
  "",
  "lg:col-span-2",
];

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

export function FeaturedProperties() {
  const { data: propertiesData, isLoading } = useGetApiProperties({ limit: "5" } as any);
  const properties = ((propertiesData as unknown as GetPropertiesResponse)?.data) || [];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        {/* Header — editorial style */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Bất động sản
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
              Sản phẩm nổi bật
            </h2>
            <p className="max-w-[48ch] text-sm leading-relaxed text-foreground-muted">
              Tuyển chọn những bất động sản tốt nhất từ các agency và chủ đầu tư trên toàn hệ sinh thái.
            </p>
          </div>
          <Button
            variant="outline"
            rightIcon={
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/8">
                <ArrowRight size={12} weight="bold" />
              </span>
            }
            render={<Link href="/listings" />}
          >
            Xem tất cả
          </Button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Spinner size={32} className="animate-spin text-primary" />
          </div>
        )}

        {/* Bento grid — Double-Bezel cards */}
        {!isLoading && properties.length > 0 && (
          <div className="grid auto-rows-[240px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[280px]">
            {properties.slice(0, 5).map((prop, i) => {
              const badge = statusBadgeMap[prop.businessStatus ?? ""];
              const span = BENTO_SPANS[i] ?? "";
              const featured = i === 0;
              const location = [prop?.district?.name, prop?.province?.name].filter(Boolean).join(", ");
              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={span}
                >
                  <Link
                    href={`/listings/${prop.id}`}
                    className="group/property relative flex h-full flex-col justify-end overflow-hidden rounded-[1.5rem] ring-1 ring-black/5"
                  >
                    {/* Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:scale-105"
                      style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Badge */}
                    {badge && (
                      <div className="absolute top-5 left-5 z-10">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    )}

                    {/* Price tag — top right, pill */}
                    <div className="absolute top-5 right-5 z-10 rounded-full bg-primary-foreground/95 px-3.5 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm">
                      {formatPrice(prop.price, prop.transactionType)}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <MapPin size={12} weight="fill" />
                        {location || "Đang cập nhật"}
                      </div>
                      <h3 className={cn(
                        "mt-2 font-serif font-semibold leading-tight",
                        featured ? "text-2xl" : "text-lg",
                      )}>
                        {prop.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                        <span className="flex items-center gap-1.5">
                          <Square size={14} /> {prop.area ? `${prop.area}m²` : "--"}
                        </span>
                        {prop.propertyType?.name && (
                          <span className="flex items-center gap-1.5">
                            {prop.propertyType.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover arrow — bottom right, button-in-button */}
                    <div className="absolute bottom-6 right-6 z-10 flex size-10 translate-y-2 items-center justify-center rounded-full bg-primary-foreground/95 text-primary opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:translate-y-0 group-hover/property:opacity-100">
                      <ArrowUpRight size={16} weight="bold" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && properties.length === 0 && (
          <div className="flex items-center justify-center py-20 text-center">
            <p className="text-sm text-foreground-muted">Chưa có bất động sản nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
