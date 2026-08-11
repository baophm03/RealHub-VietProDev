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
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = useMemo<LightboxImage[]>(
    () =>
      mediaItems.map((m: any) => ({
        id: m.id,
        url: m.file?.url ?? "",
        alt: m.caption || property?.title || "",
        caption: m.caption,
      })),
    [mediaItems, property],
  );

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

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
  const contactInfoFields = getFieldsByGroupCode("contact_info");

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

  const contactInfo = contactInfoFields.length > 0
    ? [{
      name: contactInfoFields.find((f) => f.key === "contact_name")?.value ?? null,
      phone: contactInfoFields.find((f) => f.key === "phone_number_contact")?.value ?? null,
      position: contactInfoFields.find((f) => f.key === "position")?.value ?? null,
    }]
    : [];

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
          onClick={() => router.push("/dashboard/properties")}
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
          onClick={() => router.push(`/dashboard/properties/${params.id}/edit`)}
        >
          <PencilSimple size={14} />
          Chỉnh sửa
        </Button>
      </div>

      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Link href="/dashboard/properties" className="transition-colors hover:text-foreground">
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
                onClick={() => (hasMore ? openLightbox(0) : openLightbox(i))}
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
            {property?.description ? (
              <div
                className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg prose-img:my-4 text-foreground-muted"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            ) : (
              <p className="text-base leading-relaxed text-foreground-muted">
                Chưa có mô tả chi tiết cho bất động sản này.
              </p>
            )}
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
              Vị trí
            </h2>
            <iframe
              width="100%"
              height="400"
              className="border-0"
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${property?.latitude || 0},${property?.longitude || 0}&z=15&output=embed`}>
            </iframe>
          </section>
        </div>

        {/* Right Column: Contact Sidebar */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)]">
            {/* Agent Info */}
            {contactInfo.map((item) =>
              <div key={item.name}>
                <div className="flex items-center gap-4 border-border pb-6">
                  <div className="size-16 overflow-hidden rounded-lg border border-primary/20">
                    <img
                      src="/avatar-fallback.png"
                      alt={item.name ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-foreground">{item.name || "Chưa có thông tin"}</h3>
                    <p className="text-xs text-foreground-muted">{item.position || "Chưa có vị trí"}</p>
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full">
                  <Phone size={14} />
                  {item.phone}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={lightboxImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
