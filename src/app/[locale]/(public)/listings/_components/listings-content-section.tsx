import { MapPin, Square, BedDouble, Bath, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  formatPriceWithTransaction as formatPrice,
} from "@/utils";
import { getApiProperties } from "@/lib/api/endpoints/properties";
import { getApiFormSchemas } from "@/lib/api/endpoints/dynamic-fields";
import type {
  GetPropertiesResponse,
  Property,
  PropertyMedia,
} from "@/lib/api/types/properties";
import { ListingsToolbar } from "./listings-toolbar";

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

const badgeBase =
  "inline-flex h-6 min-w-[3.25rem] items-center justify-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm whitespace-nowrap";

function extractFirstImageUrlFromMedia(media: PropertyMedia[] | undefined): string | null {
  if (!media || media.length === 0) return null;
  const imageItem = media
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

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

interface ListingsContentSectionProps {
  transactionType: string;
  provinceId: string;
  types: string[];
  minPrice: string;
  maxPrice: string;
  sort: string;
}

export async function ListingsContentSection({
  transactionType,
  provinceId,
  types,
  minPrice,
  maxPrice,
  sort,
}: ListingsContentSectionProps) {
  const apiParams: Record<string, string> = {
    verificationStatus: "VERIFIED",
    publicationStatus: "PUBLIC",
    include: "media",
    limit: "100",
  };
  if (transactionType) apiParams.transactionType = transactionType;
  if (provinceId) apiParams.provinceId = provinceId;
  if (minPrice) apiParams.minPrice = minPrice;
  if (maxPrice) apiParams.maxPrice = maxPrice;

  const [propertiesRes, schemaRes] = await Promise.all([
    getApiProperties(apiParams as any),
    getApiFormSchemas({ entityType: "PROPERTY" } as any),
  ]);

  const properties: Property[] =
    ((propertiesRes as unknown as GetPropertiesResponse)?.data) || [];
  const schemas: any[] = ((schemaRes as any)?.data as any[]) || [];

  // Filter + sort
  let result = [...properties];
  if (types.length > 0) {
    result = result.filter(
      (p) => p.propertyType && types.includes(p.propertyType.code),
    );
  }
  switch (sort) {
    case "price-asc":
      result = result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      break;
    case "price-desc":
      result = result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      break;
    case "area-desc":
      result = result.sort((a, b) => (b.area || 0) - (a.area || 0));
      break;
    default:
      result = result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }

  // Pre-compute maps
  const propertyImageMap = new Map<string, string | null>();
  const bedroomsMap = new Map<string, string | null>();
  const bathroomsMap = new Map<string, string | null>();
  for (const p of result) {
    propertyImageMap.set(p.id, extractFirstImageUrlFromMedia(p.media));
    const propertyTypeId = p.propertyType?.id;
    const relevantSchemas = schemas.filter(
      (s) => !s.propertyType || s.propertyType?.id === undefined || s.propertyType?.id === propertyTypeId,
    );
    const dynamicValues = (p as any)?.dynamicValuesJson as Record<string, unknown> | undefined;
    bedroomsMap.set(
      p.id,
      findFieldValue(relevantSchemas, dynamicValues, ["bedroom", "beds", "bed_room", "phong_ngu", "phòng ngủ"]),
    );
    bathroomsMap.set(
      p.id,
      findFieldValue(relevantSchemas, dynamicValues, ["bathroom", "baths", "pathroom", "phong_tam", "phòng tắm"]),
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 min-w-0">
      <ListingsToolbar currentSort={sort} resultCount={result.length} />

      {result.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Không tìm thấy BĐS phù hợp bộ lọc.</p>
          <Link href="/listings" className="text-sm font-medium text-primary hover:underline">
            Xóa tất cả bộ lọc
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {result.map((property) => {
            const badge = statusBadge[property.businessStatus ?? ""];
            const imageUrl = propertyImageMap.get(property.id) ?? null;
            return (
              <Link
                key={property.id}
                href={`/listings/${property.propertyCode}`}
                className="group flex flex-col bg-surface rounded-xl border border-border overflow-hidden hover:border-primary transition-colors shadow-sm hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                      <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                    </div>
                  )}
                  {badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`${badgeBase} ${badge.class}`}>{badge.label}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`${badgeBase} ${property.transactionType === "SALE" ? "bg-primary text-primary-foreground" : "bg-accent-blue text-accent-blue-text"}`}>
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
                    <MapPin size={16} />
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

                  {/* Giá tiền */}
                  <div className="flex flex-col items-start justify-start gap-1 mt-1">
                    <div className="font-serif text-2xl font-bold text-primary">
                      {formatPrice(property.price, property.transactionType)}
                    </div>
                  </div>

                  {/* Thông tin phòng ngủ, phòng tắm, diện tích */}
                  <div className="flex flex-wrap items-center justify-start gap-3 mt-auto pt-4 border-t border-border text-xs text-foreground-muted">
                    {bedroomsMap.get(property.id) && (
                      <span className="flex items-center gap-1">
                        <BedDouble size={13} className="shrink-0" />
                        <span className="tabular-nums">{bedroomsMap.get(property.id)}</span>
                        <span>PN</span>
                      </span>
                    )}
                    {bathroomsMap.get(property.id) && (
                      <span className="flex items-center gap-1">
                        <Bath size={13} className="shrink-0" />
                        <span className="tabular-nums">{bathroomsMap.get(property.id)}</span>
                        <span>WC</span>
                      </span>
                    )}
                    {property.area != null && (
                      <span className="flex items-center gap-1">
                        <Square size={13} className="shrink-0" />
                        <span className="tabular-nums">
                          {property.area.toLocaleString("vi-VN")}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
