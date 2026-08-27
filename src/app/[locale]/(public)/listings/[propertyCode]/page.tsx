import { setRequestLocale } from "next-intl/server";
import {
  getApiPropertyCode,
  getApiProperties,
} from "@/lib/api/endpoints/properties";
import { getApiFormSchemas } from "@/lib/api/endpoints/dynamic-fields";
import type {
  GetPropertiesResponse,
  GetPropertyItemResponse,
  Property,
  PropertyMedia,
} from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import {
  formatPriceWithTransaction as formatPrice,
  formatPricePerSqm,
} from "@/utils";
import { Bed, Bath, MapPin, ChevronRight, Ruler, ShieldCheck, Star } from "lucide-react";
import { ListingGallery } from "./_components/listing-gallery";
import { ListingContactSidebar } from "./_components/listing-contact-sidebar";
import { FeaturedPropertiesCarousel } from "@/components/sections/featured-properties-carousel";

type Props = {
  params: Promise<{ locale: string; propertyCode: string }>;
};

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const propertiesRes = await getApiProperties({
    verificationStatus: "VERIFIED" as any,
    publicationStatus: "PUBLIC" as any,
    limit: "100",
    include: "media",
  } as any);
  const properties = (propertiesRes as unknown as GetPropertiesResponse)?.data ?? [];
  return ["vi", "en"].flatMap((locale) =>
    properties.map((p) => ({ locale, propertyCode: p.propertyCode })),
  );
}

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

function findFieldValue(
  schemas: any[],
  dynamicValues: Record<string, unknown> | undefined,
  patterns: string[],
): string | null {
  const directKeysBed = ["bed_room_count", "bedroom_count", "bedrooms", "beds", "phong_ngu"];
  const directKeysBath = ["pathroom_count", "bathroom_count", "bathrooms", "baths", "phong_tam"];
  const isBedroom = patterns.some((p) => p.includes("bed") || p.includes("ngu"));
  const isBathroom = patterns.some((p) => p.includes("bath") || p.includes("tam") || p.includes("path"));
  if (dynamicValues) {
    const keys = isBedroom ? directKeysBed : isBathroom ? directKeysBath : [];
    for (const k of keys) {
      const v = dynamicValues[k];
      if (v !== undefined && v !== null && v !== "") return String(v);
    }
  }
  for (const schema of schemas) {
    for (const f of schema.fields || []) {
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
}

function getFieldsByGroupCode(
  schemas: any[],
  dynamicValues: Record<string, unknown> | undefined,
  code: string,
): { key: string; label: string; value: string }[] {
  const result: { key: string; label: string; value: string }[] = [];
  for (const schema of schemas) {
    for (const f of schema.fields || []) {
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
}

function extractFirstImageUrlFromMedia(media: PropertyMedia[] | undefined): string | null {
  if (!media || media.length === 0) return null;
  const imageItem = media
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, propertyCode } = await params;
  setRequestLocale(locale);

  const [propertyRes, schemaRes] = await Promise.all([
    getApiPropertyCode(propertyCode),
    getApiFormSchemas({ entityType: "PROPERTY" } as any),
  ]);

  const property = (propertyRes as unknown as GetPropertyItemResponse)?.data ?? null;
  const schemas = ((schemaRes as any)?.data as any[]) || [];

  const propertyTypeId = property?.propertyType?.id;
  let similarProperties: Property[] = [];
  let similarImageMap = new Map<string, string | null>();

  if (property) {
    const similarRes = await getApiProperties(
      propertyTypeId
        ? { propertyTypeId, verificationStatus: "VERIFIED", publicationStatus: "PUBLIC", limit: "10", include: "media" }
        : { verificationStatus: "VERIFIED", publicationStatus: "PUBLIC", limit: "10", include: "media" } as any,
    );
    similarProperties = (((similarRes as unknown as GetPropertiesResponse)?.data) || [])
      .filter((p: Property) => p.propertyCode !== propertyCode)
      .slice(0, 10);

    for (const p of similarProperties) {
      similarImageMap.set(p.id, extractFirstImageUrlFromMedia(p.media));
    }
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8">
        <Link href="/listings" className="hover:text-foreground transition-colors text-sm text-foreground-muted">
          Bất động sản
        </Link>
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="mb-2 font-serif text-2xl font-semibold">Không tìm thấy bất động sản</h1>
          <p className="text-sm text-foreground-muted">Bất động sản bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
        </div>
      </div>
    );
  }

  const relevantSchemas = schemas.filter(
    (s) => !s.propertyType || s.propertyType?.id === undefined || s.propertyType?.id === propertyTypeId,
  );
  const dynamicValues = (property as any)?.dynamicValuesJson as Record<string, unknown> | undefined;

  const bedrooms = findFieldValue(relevantSchemas, dynamicValues, ["bedroom", "beds", "bed_room", "phong_ngu", "phòng ngủ"]);
  const bathrooms = findFieldValue(relevantSchemas, dynamicValues, ["bathroom", "baths", "pathroom", "phong_tam", "phòng tắm"]);
  const legalStatus = findFieldValue(relevantSchemas, dynamicValues, ["legal", "phap_ly", "pháp lý", "ownership"]);
  const direction = findFieldValue(relevantSchemas, dynamicValues, ["direction", "huong", "hướng"]);

  const basicInfoFields = getFieldsByGroupCode(relevantSchemas, dynamicValues, "basic_info");
  const specialFields = getFieldsByGroupCode(relevantSchemas, dynamicValues, "special");

  const owner = (property as any)?.owner;
  const contactInfo = owner
    ? [{
      id: owner.id ?? null,
      name: owner.fullName ?? null,
      phone: owner.phone ?? null,
      position: "Chủ bất động sản",
    }]
    : [];

  const staticSpecs = [
    { icon: Ruler, label: "Diện tích", value: property.area ? `${property.area} m²` : "—", accent: false },
    { icon: Bed, label: "Phòng ngủ", value: bedrooms ?? "—", accent: false },
    { icon: Bath, label: "Phòng tắm", value: bathrooms ?? "—", accent: false },
    { icon: ShieldCheck, label: "Pháp lý", value: legalStatus ?? "—", accent: true },
  ];

  const staticSpecLabels = new Set(["Diện tích", "Phòng ngủ", "Phòng tắm", "Pháp lý"]);
  const dynamicSpecs = basicInfoFields
    .filter((f) => !staticSpecLabels.has(f.label))
    .map((f) => ({ icon: Ruler, label: f.label, value: f.value, accent: false }));
  const specs = [...staticSpecs, ...dynamicSpecs];

  const highlights = specialFields.map((f) => ({ icon: Star, title: f.label, desc: f.value }));

  const gallery: string[] = (() => {
    const mediaList = (property as any)?.media as any[] | undefined;
    if (!mediaList || mediaList.length === 0) return [];
    return mediaList
      .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((m) => m.file?.url)
      .filter(Boolean) as string[];
  })();

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-foreground-muted mb-4">
        <Link href="/listings" className="hover:text-foreground transition-colors">Bất động sản</Link>
        <ChevronRight size={14} className="text-foreground-muted" />
        <span>{property.propertyType?.name ?? "Bất động sản"}</span>
        <ChevronRight size={14} className="text-foreground-muted" />
        <span className="truncate">{property.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${property.transactionType === "SALE" ? "bg-primary text-primary-foreground" : "bg-accent-blue text-accent-blue-text"}`}>
              {txLabel[property.transactionType] ?? property.transactionType}
            </span>
            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${property.businessStatus === "AVAILABLE" ? "bg-accent-green text-accent-green-text" : property.businessStatus === "RESERVED" ? "bg-accent-yellow text-accent-yellow-text" : property.businessStatus === "SOLD" ? "bg-accent-red text-accent-red-text" : "bg-surface-muted text-foreground-muted"}`}>
              {statusLabel[property.businessStatus ?? ""] ?? property.businessStatus}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {property.title}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-base text-foreground-muted">
            <MapPin size={16} className="text-primary" />
            {[property.district?.name, property.province?.name].filter(Boolean).join(", ") || "Đang cập nhật vị trí"}
          </p>
        </div>
        <div className="text-right">
          <div className="font-serif text-3xl font-bold text-primary md:text-4xl">
            {formatPrice(property.price, property.transactionType)}
          </div>
          <div className="text-sm text-foreground-muted">{formatPricePerSqm(property.price, property.area)}</div>
        </div>
      </div>

      {/* Image Gallery (client component) */}
      <ListingGallery images={gallery} propertyCode={property.propertyCode} />

      {/* Main Layout: Content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Details */}
        <div className="flex-grow w-full lg:w-2/3 space-y-8">
          {/* Key Specs Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-muted rounded-xl border border-border">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{spec.label}</span>
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={spec.accent ? "text-accent-green-text" : "text-primary"} />
                    <span className="font-serif text-xl font-medium text-primary">{spec.value}</span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">Mô tả chi tiết</h2>
            {(property as any).description ? (
              <div
                className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg prose-img:my-4 text-foreground-muted"
                dangerouslySetInnerHTML={{ __html: (property as any).description }}
              />
            ) : (
              <p className="text-base leading-relaxed text-foreground-muted">
                Chưa có mô tả chi tiết cho bất động sản này.
              </p>
            )}
          </section>

          {/* Highlights / Features */}
          {highlights.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">Đặc điểm nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-border">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="font-serif text-base font-medium text-primary">{item.title}</h3>
                        <p className="text-xs text-foreground-muted">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

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

        {/* Right Column: Contact Sidebar (client component) */}
        <ListingContactSidebar
          propertyId={property.id}
          contacts={contactInfo}
          propertyTypeName={property.propertyType?.name}
          direction={direction}
          sellingMode={property.sellingMode}
          createdAt={property.createdAt}
        />
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="pt-8 border-t border-border mt-8">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-primary">Bất động sản tương tự</h2>
            <p className="text-sm text-foreground-muted">
              Những bất động sản cùng loại có thể phù hợp với bạn.
            </p>
          </div>
          <FeaturedPropertiesCarousel properties={similarProperties} imageMap={similarImageMap} />
        </section>
      )}
    </div>
  );
}
