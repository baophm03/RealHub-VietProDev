"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Bed, Bathtub, MapPin, House, Phone, CheckCircle, SealCheck, Star, CaretRight, PaperPlaneTilt, Car, Bathtub as Pool, Shield, Spinner } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { useGetApiPropertyId, useGetApiProperties } from "@/lib/api/endpoints/properties";
import { GetPropertiesResponse, Property } from "@/lib/api/types/properties";

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const statusLabel: Record<string, string> = {
  AVAILABLE: "Sẵn có",
  RESERVED: "Đặt cọc",
  SOLD: "Đã bán",
  RENTED: "Đã thuê",
  OFF_MARKET: "Ngừng bán",
};

const sellingModeLabel: Record<string, string> = {
  SALES_DISTRIBUTION: "Phân phối sales",
  SELF_SELL: "Tự bán",
  HYBRID: "Kết hợp",
  MARKETPLACE_PUBLIC: "Marketplace",
  INTERNAL_ONLY: "Nội bộ",
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

const DEFAULT_FEATURES = ["Mặt tiền", "Đường lớn", "Chỗ để xe", "Phù hợp kinh doanh"];

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeImage, setActiveImage] = useState(0);
  const { data: propertyData, isLoading } = useGetApiPropertyId(id);
  const property = (propertyData as unknown as { data: Property })?.data;

  const { data: allPropertiesData } = useGetApiProperties();
  const allProperties = ((allPropertiesData as unknown as GetPropertiesResponse)?.data) || [];
  const similarProperties = allProperties
    .filter((p) => p.id !== id && p.transactionType === property?.transactionType)
    .slice(0, 3);

  const gallery = [PLACEHOLDER_IMAGE];

  const HIGHLIGHT_ICONS: Record<string, React.ElementType> = {
    "Hồ bơi": Pool,
    "Hồ bơi riêng": Pool,
    "An ninh 24/7": Shield,
    "Garage 2 xe": Car,
    "Gara ô tô": Car,
    "Sân vườn": House,
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8">
        <div className="flex items-center justify-center py-20">
          <Spinner size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Không tìm thấy bất động sản này.</p>
          <Link href="/listings" className="text-sm font-medium text-primary hover:underline">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-foreground-muted mb-4">
        <Link href="/listings" className="hover:text-foreground transition-colors">Bất động sản</Link>
        <CaretRight size={14} className="text-foreground-muted" />
        <span>{property.propertyType?.name ?? "Bất động sản"}</span>
        <CaretRight size={14} className="text-foreground-muted" />
        <span className="truncate">{property.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${property.transactionType === "SALE" ? "bg-primary text-primary-foreground" : "bg-accent-blue text-accent-blue-text"
              }`}>
              {txLabel[property.transactionType] ?? property.transactionType}
            </span>
            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${property.businessStatus === "AVAILABLE" ? "bg-accent-green text-accent-green-text" :
              property.businessStatus === "RESERVED" ? "bg-accent-yellow text-accent-yellow-text" :
                property.businessStatus === "SOLD" ? "bg-accent-red text-accent-red-text" :
                  "bg-surface-muted text-foreground-muted"
              }`}>
              {statusLabel[property.businessStatus ?? ""] ?? property.businessStatus}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {property.title}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-base text-foreground-muted">
            <MapPin size={16} weight="fill" className="text-primary" />
            {property.address ?? "Đang cập nhật vị trí"}
          </p>
        </div>
        <div className="text-right">
          <div className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {formatPrice(property.price, property.transactionType)}
          </div>
          <div className="text-sm text-foreground-muted">{formatPricePerSqm(property.price, property.area)}</div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
        <div
          className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
          onClick={() => setActiveImage(0)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${gallery[activeImage]})` }}
          />
          <div className="absolute top-4 right-4 z-10">
            <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm bg-surface/90 backdrop-blur-sm text-primary">
              {property.propertyCode}
            </span>
          </div>
        </div>
        {gallery.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => setActiveImage(i + 1)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${img})` }}
            />
            {i === 3 && gallery.length > 5 && (
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white font-serif text-xl font-medium">+{gallery.length - 5} Ảnh</span>
              </div>
            )}
          </div>
        ))}
        {gallery.length < 5 && Array.from({ length: 5 - gallery.length }).map((_, i) => (
          <div key={`placeholder-${i}`} className="hidden md:block relative overflow-hidden bg-surface-muted" />
        ))}
      </div>

      {/* Main Layout: Content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Details */}
        <div className="flex-grow w-full lg:w-2/3 space-y-8">
          {/* Key Specs Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-muted rounded-xl border border-border">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Diện tích</span>
              <div className="flex items-center gap-2">
                <House size={20} className="text-primary" />
                <span className="font-serif text-xl font-medium text-primary">{property.area ? `${property.area} m²` : "—"}</span>
              </div>
            </div>
            {(property as any).bedrooms > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Phòng ngủ</span>
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-primary" />
                  <span className="font-serif text-xl font-medium text-primary">{(property as any).bedrooms}</span>
                </div>
              </div>
            )}
            {(property as any).bathrooms > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Phòng tắm</span>
                <div className="flex items-center gap-2">
                  <Bathtub size={20} className="text-primary" />
                  <span className="font-serif text-xl font-medium text-primary">{(property as any).bathrooms}</span>
                </div>
              </div>
            )}
            {(property as any).legalStatus && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Pháp lý</span>
                <div className="flex items-center gap-2">
                  <SealCheck size={20} className="text-primary" />
                  <span className="font-serif text-xl font-medium text-primary">{(property as any).legalStatus}</span>
                </div>
              </div>
            )}
          </section>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">Mô tả chi tiết</h2>
            <p className="text-base leading-relaxed text-foreground-muted">
              {(property as any).description ?? "Chưa có mô tả chi tiết cho bất động sản này."}
            </p>
          </section>

          {/* Highlights / Features */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">Đặc điểm nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray((property as any).features) && (property as any).features.length > 0
                ? (property as any).features
                : DEFAULT_FEATURES
              ).map((f: string) => {
                const Icon = HIGHLIGHT_ICONS[f] ?? CheckCircle;
                return (
                  <div key={f} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-border">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-medium text-primary">{f}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tags */}
          {Array.isArray((property as any).tags) && (property as any).tags.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">Nhãn</h2>
              <div className="flex flex-wrap gap-2">
                {(property as any).tags.map((tag: string) => (
                  <span key={tag} className="bg-surface-muted text-xs px-3 py-1.5 rounded-lg text-foreground-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Map Section */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">Vị trí</h2>
            <div className="w-full h-80 bg-surface-muted rounded-xl border border-border overflow-hidden relative flex items-center justify-center">
              <div className="text-center text-foreground-muted">
                <MapPin size={48} weight="fill" className="mx-auto mb-2 text-primary" />
                <p className="text-sm">{property.address ?? "Đang cập nhật vị trí"}</p>
                <p className="text-xs mt-1">Bản đồ sẽ hiển thị tại đây</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Contact Sidebar */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-6">
            {/* Agent Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-lg font-bold text-primary">
                {(property as any).assignedTo?.split(" ").slice(-1).map((n: string) => n[0]).join("") ?? "—"}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">{(property as any).assignedTo ?? "Chưa gán"}</h3>
                <p className="text-sm text-foreground-muted">Chuyên viên Tư vấn</p>
                <div className="flex items-center gap-1 mt-1" style={{ color: "#3b6934" }}>
                  <Star size={14} weight="fill" />
                  <span className="text-xs font-semibold uppercase tracking-wide">4.9 (120 Đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4">
              <h4 className="font-serif text-xl font-semibold text-primary">Liên hệ ngay</h4>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-foreground">Họ và tên</label>
                <input
                  type="text" placeholder="Nhập họ và tên..."
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-foreground">Số điện thoại</label>
                <input
                  type="tel" placeholder="Nhập số điện thoại..."
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-foreground">Lời nhắn</label>
                <textarea
                  placeholder="Tôi quan tâm đến bất động sản này..." rows={3}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
                />
              </div>
              <Button className="w-full" size="lg" leftIcon={<PaperPlaneTilt size={16} />}>
                Gửi yêu cầu
              </Button>
              <Button variant="outline" className="w-full" size="lg" leftIcon={<Phone size={16} />}>
                0901 234 567
              </Button>
            </form>

            {/* Property Meta */}
            <div className="border-t border-border pt-4 space-y-2 text-xs text-foreground-muted">
              <div className="flex justify-between">
                <span>Loại hình</span>
                <span className="font-medium text-foreground">{property.propertyType?.name ?? "—"}</span>
              </div>
              {(property as any).direction && (
                <div className="flex justify-between">
                  <span>Hướng</span>
                  <span className="font-medium text-foreground">{(property as any).direction}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Chế độ bán</span>
                <span className="font-medium text-foreground">
                  {sellingModeLabel[property.sellingMode ?? ""] ?? property.sellingMode ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ngày đăng</span>
                <span className="font-medium text-foreground">{new Date(property.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="pt-8 border-t border-border mt-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-primary mb-6">Bất động sản tương tự</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <Link
                key={p.id}
                href={`/listings/${p.id}`}
                className="group bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}
                  />
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg font-medium text-primary line-clamp-1 group-hover:text-primary/80 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-foreground-muted flex items-center gap-1">
                    <MapPin size={14} weight="fill" /> {p.address ?? "Đang cập nhật"}
                  </p>
                  <div className="font-serif text-xl font-bold text-primary">
                    {formatPrice(p.price, p.transactionType)}
                  </div>
                  <div className="flex items-center gap-4 border-t border-border pt-3 mt-auto">
                    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      <House size={14} /> {p.area ? `${p.area}m²` : "—"}
                    </div>
                    {(p as any).bedrooms > 0 && (
                      <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                        <Bed size={14} /> {(p as any).bedrooms}
                      </div>
                    )}
                    {(p as any).bathrooms > 0 && (
                      <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                        <Bathtub size={14} /> {(p as any).bathrooms}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
