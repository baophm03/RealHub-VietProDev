"use client";

import { useState } from "react";
import { mockProperties } from "@/lib/mock/properties";
import { Button } from "@/components/ui/button";
import { Bed, Bathtub, MapPin, House, ArrowLeft, Phone, Calendar, CheckCircle } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";

export default function ListingDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const property = mockProperties[0];
  const gallery = property.gallery.length > 0 ? property.gallery : [property.image];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-8 md:py-12 lg:px-12">
      <Link
        href="/listings"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          <div className="overflow-hidden rounded-lg">
            <div
              className="aspect-[16/10] bg-cover bg-center"
              style={{ backgroundImage: `url(${gallery[activeImage]})` }}
            />
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-28 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                {property.transactionType === "SALE" ? "Bán" : "Cho thuê"}
              </span>
              <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
                {property.type}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground-muted">
              <MapPin size={14} weight="fill" /> {property.address}, {property.province}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-6 md:grid-cols-4">
            {property.bedrooms > 0 && (
              <div className="flex flex-col gap-1">
                <Bed size={20} className="text-primary" />
                <span className="text-lg font-semibold">{property.bedrooms}</span>
                <span className="text-xs text-foreground-muted">Phòng ngủ</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex flex-col gap-1">
                <Bathtub size={20} className="text-primary" />
                <span className="text-lg font-semibold">{property.bathrooms}</span>
                <span className="text-xs text-foreground-muted">WC</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <House size={20} className="text-primary" />
              <span className="text-lg font-semibold">{property.area}m²</span>
              <span className="text-xs text-foreground-muted">Diện tích</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-primary">{property.priceText}</span>
              <span className="text-xs text-foreground-muted">Giá</span>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-xl font-semibold">Mô tả</h2>
            <p className="text-base leading-relaxed text-foreground-muted">{property.description}</p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-xl font-semibold">Tiện ích</h2>
            <div className="flex flex-wrap gap-2">
              {property.features.map((f) => (
                <span key={f} className="flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-2 text-sm">
                  <CheckCircle size={14} className="text-primary" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Giá</span>
              <p className="text-2xl font-semibold text-primary">{property.priceText}</p>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Liên hệ tư vấn</h3>
              <div className="flex items-center gap-3 rounded-lg bg-surface-muted p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                  {property.assignedTo?.split(" ").slice(-1).map((n) => n[0]).join("") ?? "—"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{property.assignedTo ?? "Chưa gán"}</span>
                  <span className="text-xs text-foreground-muted">Sales phụ trách</span>
                </div>
              </div>

              <Button size="lg" className="w-full" leftIcon={<Phone size={16} />}>
                Liên hệ ngay
              </Button>
              <Button variant="outline" size="lg" className="w-full" leftIcon={<Calendar size={16} />}>
                Đặt lịch xem nhà
              </Button>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-2 text-xs text-foreground-muted">
              <div className="flex justify-between">
                <span>Chế độ bán</span>
                <span className="font-medium text-foreground">{property.sellingMode === "SALES_DISTRIBUTION" ? "Phân phối sales" : property.sellingMode === "SELF_SELL" ? "Tự bán" : property.sellingMode === "HYBRID" ? "Kết hợp" : "Marketplace"}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày đăng</span>
                <span className="font-medium text-foreground">{new Date(property.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Cập nhật</span>
                <span className="font-medium text-foreground">{new Date(property.updatedAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
