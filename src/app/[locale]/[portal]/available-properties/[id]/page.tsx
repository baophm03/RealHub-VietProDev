"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { formatPrice } from "@/utils";
import {
  ArrowLeft,
  Bath,
  Bed,
  Camera,
  ChevronRight,
  Handshake,
  Loader2,
  MapPin,
  Ruler,
  ShieldCheck,
  Star,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiPropertyId, useGetApiPropertyMedia } from "@/lib/api/endpoints/properties";
import { useGetApiFormSchemas } from "@/lib/api/endpoints/dynamic-fields";
import { Property } from "@/lib/api/types/properties";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";
import { customInstance } from "@/lib/api/mutator/custom-instance";

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

const sellingModeLabel: Record<string, string> = {
  SELF_SELL: "Tự bán",
  SALES_DISTRIBUTION: "Sales bán hộ",
  HYBRID: "Kết hợp",
  INTERNAL_ONLY: "Chỉ nội bộ",
  AGENCY_DISTRIBUTION: "Sàn công khai",
};

export default function AvailablePropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: propertyData, isLoading } = useGetApiPropertyId(id);
  const property = (propertyData as unknown as { data: Property })?.data;

  const { data: mediaData } = useGetApiPropertyMedia(id);
  const mediaItems = useMemo(() => {
    const raw = (mediaData as any)?.data;
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [];
    return items
      .filter((m: any) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [mediaData]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [claiming, setClaiming] = useState(false);

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

  const staticSpecs = [
    { icon: Ruler, label: "Diện tích", value: property ? `${areaNum} m2` : "-", accent: false },
    { icon: Bed, label: "Phòng ngủ", value: bedrooms || (property ? "-" : "-"), accent: false },
    { icon: Bath, label: "Phòng tắm", value: bathrooms || (property ? "-" : "-"), accent: false },
    { icon: ShieldCheck, label: "Pháp lý", value: legalStatus || (property ? "-" : "-"), accent: true },
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

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await customInstance({
        url: "/api/assignments",
        method: "POST",
        data: {
          propertyId: id,
          assignmentType: "SALES",
          source: "SELF_ASSIGN",
        },
      });
      toast.success("Nhận phụ trách thành công");
      router.push("/vi/sales-portal/available-properties");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Có lỗi khi nhận phụ trách";
      toast.error(msg);
    } finally {
      setClaiming(false);
    }
  };

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
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/vi/sales-portal/available-properties")}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          Quay lại danh sách
        </button>
        <Button onClick={handleClaim} disabled={claiming}>
          {claiming ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang nhận...
            </>
          ) : (
            <>
              <Handshake size={16} />
              Nhận phụ trách
            </>
          )}
        </Button>
      </div>

      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Link href="/vi/sales-portal/available-properties" className="transition-colors hover:text-foreground">
            Nhận phụ trách
          </Link>
          <ChevronRight size={12} />
          <span>{property?.propertyCode ?? "-"}</span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-4xl">
                {property?.title ?? "-"}
              </h1>
              <Badge variant="blue" className="shrink-0">
                {sellingModeLabel[property?.sellingMode ?? ""] ?? property?.sellingMode}
              </Badge>
            </div>
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
                    <Camera size={32} className="text-foreground-muted" />
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
        <div className="flex h-[300px] items-center justify-center rounded-lg bg-surface-muted">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <Camera size={40} />
            <span className="text-sm">Chưa có hình ảnh</span>
          </div>
        </div>
      )}

      {/* Specs grid */}
      {specs.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div key={i} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
                <Icon size={18} className={spec.accent ? "text-primary" : "text-foreground-muted"} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-foreground-muted">{spec.label}</span>
                  <span className="text-sm font-medium text-foreground">{spec.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={i} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
                <Icon size={18} className="text-primary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{h.title}</span>
                  <span className="text-xs text-foreground-muted">{h.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Description */}
      {property?.description ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
            Mô tả chi tiết
          </h2>
          <div
            className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg prose-img:my-4 text-foreground-muted"
            dangerouslySetInnerHTML={{ __html: property.description }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
            Mô tả chi tiết
          </h2>
          <p className="text-base leading-relaxed text-foreground-muted">
            Chưa có mô tả chi tiết cho bất động sản này.
          </p>
        </div>
      )}

      {/* CTA bottom */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-lg border border-border bg-surface/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-0.5">
          <span className="font-serif text-xl font-medium text-primary">
            {property ? formatPrice(priceNum) : "-"}
          </span>
          <span className="text-xs text-foreground-muted">
            {property?.propertyType?.name} · {txLabel[property?.transactionType ?? ""] ?? property?.transactionType}
          </span>
        </div>
        <Button onClick={handleClaim} disabled={claiming} size="lg">
          {claiming ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang nhận...
            </>
          ) : (
            <>
              <Handshake size={16} />
              Nhận phụ trách
            </>
          )}
        </Button>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          images={lightboxImages}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
