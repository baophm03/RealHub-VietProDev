"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Bathtub,
  Bed,
  Ruler,
  ShieldCheck,
  Car,
  SwimmingPool,
  SecurityCamera,
  Park,
  Star,
  Phone,
  PaperPlaneTilt,
  Camera,
  CaretRight,
  PencilSimple,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGetApiPropertyId, useGetApiProperties, useGetApiPropertyMedia } from "@/lib/api/endpoints/properties";
import { useGetApiFormSchemas } from "@/lib/api/endpoints/dynamic-fields";
import { Property } from "@/lib/api/types/properties";

function formatPrice(price: number): string {
  if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ`;
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu`;
  return price.toLocaleString("vi-VN");
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // server
  const { data: propertyData, isLoading } = useGetApiPropertyId(id);
  const property = (propertyData as unknown as { data: Property })?.data;

  // media
  const { data: mediaData } = useGetApiPropertyMedia(id);
  const mediaItems = useMemo(() => {
    const raw = (mediaData as any)?.data;
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [];
    return items
      .filter((m: any) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [mediaData]);

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: "Tôi quan tâm đến bất động sản này...",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", contactForm);
  };

  const priceNum = Number(property?.price || 0);
  const areaNum = property?.area ?? 0;
  const pricePerM2 = areaNum > 0 ? priceNum / areaNum : 0;

  const propertyTypeId = property?.propertyType?.id;

  const { data: schemaData } = useGetApiFormSchemas({ entityType: "PROPERTY" });
  const allSchemas = ((schemaData as any)?.data as any[]) || [];
  const schemas = useMemo(
    () => allSchemas.filter(
      (s) => s.propertyTypeId === null || s.propertyTypeId === undefined || s.propertyTypeId === propertyTypeId,
    ),
    [allSchemas, propertyTypeId],
  );
  const dynamicValues = (property as any)?.dynamicValuesJson as Record<string, unknown> | undefined;

  const findFieldValue = useMemo(() => {
    return (patterns: string[]): string | null => {
      for (const schema of schemas) {
        for (const f of (schema.fields || [])) {
          const field = f.field;
          if (!field) continue;
          const key = (field.fieldKey || "").toLowerCase();
          const label = (field.fieldLabel || "").toLowerCase();
          if (patterns.some((p) => key.includes(p) || label.includes(p))) {
            const rawValue = dynamicValues?.[field.fieldKey];
            if (rawValue === undefined || rawValue === null || rawValue === "") return null;
            if (field.options && Array.isArray(field.options)) {
              const opt = field.options.find((o: any) => o.value === String(rawValue));
              if (opt) return opt.label;
            }
            return String(rawValue);
          }
        }
      }
      return null;
    };
  }, [schemas, dynamicValues]);

  const bedrooms = findFieldValue(["bedroom", "beds", "phong_ngu", "phòng ngủ"]);
  const bathrooms = findFieldValue(["bathroom", "baths", "phong_tam", "phòng tắm"]);
  const legalStatus = findFieldValue(["legal", "phap_ly", "pháp lý", "ownership"]);

  const getFieldsByGroupCode = useMemo(() => {
    return (code: string) => {
      const result: { key: string; label: string; value: string }[] = [];
      for (const schema of schemas) {
        for (const f of (schema.fields || [])) {
          const field = f.field;
          if (!field) continue;
          if (f.group?.code === code) {
            const rawValue = dynamicValues?.[field.fieldKey];
            if (rawValue === undefined || rawValue === null || rawValue === "") continue;
            let displayValue = String(rawValue);
            if (field.options && Array.isArray(field.options)) {
              const opt = field.options.find((o: any) => o.value === String(rawValue));
              if (opt) displayValue = opt.label;
            }
            result.push({ key: field.fieldKey, label: field.fieldLabel, value: displayValue });
          }
        }
      }
      return result;
    };
  }, [schemas, dynamicValues]);

  const basicInfoFields = getFieldsByGroupCode("basic_info");
  const specialFields = getFieldsByGroupCode("special");

  const { data: similarData } = useGetApiProperties(
    propertyTypeId ? { propertyTypeId, limit: "10" } : undefined,
  );
  const similarProperties = useMemo(() => {
    const all = ((similarData as any)?.data as Property[]) || [];
    const filtered = all.filter((p) => p.id !== id);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [similarData, id]);

  const staticSpecs = [
    { icon: Ruler, label: "Diện tích", value: property ? `${areaNum} m2` : "227 m2", accent: false },
    { icon: Bed, label: "Phòng ngủ", value: bedrooms || (property ? "-" : "4"), accent: false },
    { icon: Bathtub, label: "Phòng tắm", value: bathrooms || (property ? "-" : "4"), accent: false },
    { icon: ShieldCheck, label: "Pháp lý", value: legalStatus || (property ? "-" : "Sổ hồng"), accent: true },
  ];

  const staticSpecLabels = new Set(["Diện tích", "Phòng ngủ", "Phòng tắm", "Pháp lý"]);

  const dynamicSpecs = basicInfoFields
    .filter((f) => !staticSpecLabels.has(f.label))
    .map((f) => ({
      icon: Ruler,
      label: f.label,
      value: f.value,
      accent: false,
    }));

  const specs = [...staticSpecs, ...dynamicSpecs];

  const highlights = specialFields.map((f) => ({
    icon: Star,
    title: f.label,
    desc: f.value,
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-muted" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="h-10 w-3/4 animate-pulse rounded-lg bg-surface-muted" />
        <div className="h-[400px] animate-pulse rounded-lg bg-surface-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back button + Edit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/properties")}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          Quay lại danh sách
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/properties/properties/${params.id}/edit`)}
        >
          <PencilSimple size={14} />
          Chỉnh sửa
        </Button>
      </div>

      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Link href="/properties" className="transition-colors hover:text-foreground">
            Bất động sản
          </Link>
          <CaretRight size={12} />
          <span>{property?.province?.name ?? "-"}</span>
          <CaretRight size={12} />
          <span>{property?.district?.name ?? "-"}</span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-4xl">
              {property?.title ?? "-"}
            </h1>
            <p className="flex items-center gap-2 text-sm text-foreground-muted md:text-base">
              <MapPin size={16} className="text-primary" />
              {property?.district?.name ?? "-"}, {property?.province?.name ?? "-"}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 md:items-end">
            <span className="font-serif text-3xl font-medium text-primary md:text-4xl">
              {property ? formatPrice(priceNum) : "-"}
            </span>
            <span className="text-sm text-foreground-muted">
              {property && pricePerM2 > 0 ? `~ ${formatPrice(pricePerM2)}/m2` : "~ -"}
            </span>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          {mediaItems.slice(0, 5).map((img: any, i: number) => {
            const url = img.file?.url;
            const isPrimary = img.isPrimary;
            const hasMore = mediaItems.length > 5 && i === 4;
            return (
              <div
                key={img.id || i}
                className={`relative group cursor-pointer ${i === 0 ? "md:col-span-2 md:row-span-2" : ""} ${i >= 1 ? "hidden md:block" : ""}`}
              >
                {url ? (
                  <img
                    src={url}
                    alt={img.caption || property?.title || ""}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                    <Camera size={32} weight="duotone" className="text-foreground-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                {isPrimary && i === 0 && (
                  <div className="absolute top-4 right-4 rounded-lg bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                    Ảnh chính
                  </div>
                )}
                {hasMore && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                    <span className="font-serif text-xl font-medium text-white">+{mediaItems.length - 5} Ảnh</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <Camera size={32} weight="duotone" />
            <p className="text-sm">Chưa có hình ảnh cho bất động sản này</p>
          </div>
        </div>
      )}

      {/* Main Layout: Content + Sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left Column: Details */}
        <div className="flex-grow space-y-10 w-full lg:w-2/3">
          {/* Key Specs Grid */}
          <section className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-6 md:grid-cols-4">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                    {spec.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Icon size={20} weight="duotone" className={spec.accent ? "text-accent-green-text" : "text-primary"} />
                    <span className="font-serif text-xl font-medium text-foreground">
                      {spec.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Description */}
          <section className="flex flex-col gap-4">
            <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
              Mô tả chi tiết
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed text-foreground-muted">
              <p>
                {property?.description || "Chưa có mô tả chi tiết cho bất động sản này."}
              </p>
            </div>
          </section>

          {/* Highlights / Features */}
          {highlights.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
                Đặc điểm nổi bật
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/20 hover:shadow-[0_4px_16px_-8px_rgba(45,95,63,0.12)]"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon size={20} weight="duotone" className="text-primary" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        <p className="text-xs text-foreground-muted">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Map Section */}
          <section className="flex flex-col gap-4">
            <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
              Vi tri
            </h2>
            <div className="h-80 w-full overflow-hidden rounded-lg border border-border bg-surface-muted">
              <div className="flex h-full w-full items-center justify-center bg-surface-muted/50">
                <div className="flex flex-col items-center gap-2 text-foreground-muted">
                  <MapPin size={32} weight="duotone" className="text-primary" />
                  <p className="text-sm">Bản đồ sẽ hiển thị tại đây</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Contact Sidebar */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)]">
            {/* Agent Info */}
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="size-16 overflow-hidden rounded-lg border-2 border-primary/20">
                <img
                  src="https://picsum.photos/seed/agent-tran-huu-kien/200/200"
                  alt="Tran Huu Kien"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-foreground">Tran Huu Kien</h3>
                <p className="text-xs text-foreground-muted">Chuyen vien Tu van Cap cao</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} weight="fill" className="text-primary" />
                  <span className="text-[11px] font-medium text-foreground-muted">
                    4.9 (120 Danh gia)
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h4 className="font-serif text-lg font-medium text-foreground">Lien he ngay</h4>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Họ và tên</Label>
                <Input
                  id="contact-name"
                  placeholder="Nhap Họ và tên..."
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-phone">Số điện thoại</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="Nhap Số điện thoại..."
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-message">Loi nhan</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Toi quan tam den bat dong san nay..."
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                <PaperPlaneTilt size={14} />
                Gui yeu cau
              </Button>

              <Button type="button" variant="outline" className="w-full">
                <Phone size={14} />
                0901 234 567
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <section className="flex flex-col gap-6 border-t border-border pt-10">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          Bất động sản tương tự
        </h2>
        {similarProperties.length === 0 ? (
          <p className="text-sm text-foreground-muted">Chưa có bất động sản tương tự.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {similarProperties.map((item) => {
              const itemPrice = Number(item.price || 0);
              const itemArea = item.area ?? 0;
              const itemDynValues = (item as any).dynamicValuesJson as Record<string, unknown> | undefined;

              const itemBedrooms = (() => {
                for (const schema of schemas) {
                  for (const f of (schema.fields || [])) {
                    const field = f.field;
                    if (!field) continue;
                    const key = (field.fieldKey || "").toLowerCase();
                    const label = (field.fieldLabel || "").toLowerCase();
                    if (["bedroom", "beds", "phong_ngu", "phòng ngủ"].some((p) => key.includes(p) || label.includes(p))) {
                      const v = itemDynValues?.[field.fieldKey];
                      if (v !== undefined && v !== null && v !== "") return String(v);
                    }
                  }
                }
                return "-";
              })();

              const itemBathrooms = (() => {
                for (const schema of schemas) {
                  for (const f of (schema.fields || [])) {
                    const field = f.field;
                    if (!field) continue;
                    const key = (field.fieldKey || "").toLowerCase();
                    const label = (field.fieldLabel || "").toLowerCase();
                    if (["bathroom", "baths", "phong_tam", "phòng tắm"].some((p) => key.includes(p) || label.includes(p))) {
                      const v = itemDynValues?.[field.fieldKey];
                      if (v !== undefined && v !== null && v !== "") return String(v);
                    }
                  }
                }
                return "-";
              })();

              const location = [item.district?.name, item.province?.name].filter(Boolean).join(", ");

              return (
                <Link
                  key={item.id}
                  href={`/properties/properties/${item.id}`}
                  className="group flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-12px_rgba(45,95,63,0.12)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${item.id}/800/600`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Camera size={10} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    <h3 className="text-base font-semibold tracking-tight text-foreground line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
                      <MapPin size={14} className="text-primary" />
                      {location || "-"}
                    </p>
                    <div className="font-serif text-xl font-medium text-primary">
                      {formatPrice(itemPrice)}
                    </div>
                    <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-foreground-muted">
                      <span className="flex items-center gap-1">
                        <Ruler size={12} /> {itemArea} m2
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed size={12} /> {itemBedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bathtub size={12} /> {itemBathrooms}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
