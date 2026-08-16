import { getApiProperties, getApiPropertyMedia } from "@/lib/api/endpoints/properties";
import type { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import { formatPriceWithTransaction as formatPrice } from "@/utils";
import { ArrowRight, MapPin, Square, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

function extractFirstImageUrl(mediaRes: unknown): string | null {
  const raw = mediaRes as any;
  const items: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  if (items.length === 0) return null;
  const imageItem = items
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

const statusBadgeMap: Record<string, { className: string; label: string }> = {
  AVAILABLE: { className: "bg-accent-green text-accent-green-text", label: "Sẵn có" },
  RESERVED: { className: "bg-accent-yellow text-accent-yellow-text", label: "Đặt cọc" },
  SOLD: { className: "bg-accent-red text-accent-red-text", label: "Đã bán" },
  RENTED: { className: "bg-accent-blue text-accent-blue-text", label: "Đã thuê" },
  OFF_MARKET: { className: "bg-secondary text-secondary-foreground", label: "Ngừng bán" },
};

const BENTO_SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "",
  "",
  "",
  "lg:col-span-2",
];

const badgeBase =
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap";

export async function FeaturedProperties() {
  let properties: Property[] = [];
  let propertyImageMap = new Map<string, string | null>();

  try {
    const propertiesRes = await getApiProperties({
      verificationStatus: "VERIFIED",
      publicationStatus: "PUBLIC",
      limit: "5",
    } as any);
    properties = (propertiesRes as unknown as GetPropertiesResponse)?.data ?? [];

    const mediaSettled = await Promise.allSettled(
      properties.map(async (p) => {
        const mediaRes = await getApiPropertyMedia(p.id);
        return { id: p.id, url: extractFirstImageUrl(mediaRes) };
      }),
    );
    propertyImageMap = new Map(
      mediaSettled
        .filter((r): r is PromiseFulfilledResult<{ id: string; url: string | null }> => r.status === "fulfilled")
        .map((r) => [r.value.id, r.value.url]),
    );
  } catch {
    // Keep defaults (empty) — section renders empty state
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        {/* Header */}
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
          <Link
            href="/listings"
            className="group inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium shadow-xs transition-all hover:bg-muted hover:text-foreground"
          >
            Xem tất cả
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/8">
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        {/* Bento grid */}
        {properties.length > 0 && (
          <div className="grid auto-rows-[240px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[280px]">
            {properties.slice(0, 5).map((prop, i) => {
              const badge = statusBadgeMap[prop.businessStatus ?? ""];
              const span = BENTO_SPANS[i] ?? "";
              const featured = i === 0;
              const location = [prop?.district?.name, prop?.province?.name].filter(Boolean).join(", ");
              const imageUrl = propertyImageMap.get(prop.id) ?? null;
              return (
                <div key={prop.id} className={span}>
                  <Link
                    href={`/listings/${prop.id}`}
                    className="group/property relative flex h-full flex-col justify-end overflow-hidden rounded-[1.5rem] ring-1 ring-black/5"
                  >
                    {/* Image */}
                    <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:scale-105">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={prop.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                          <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                        </div>
                      )}
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Badge */}
                    {badge && (
                      <div className="absolute top-5 left-5 z-10">
                        <span className={cn(badgeBase, badge.className)}>
                          {badge.label}
                        </span>
                      </div>
                    )}

                    {/* Price tag */}
                    <div className="absolute top-5 right-5 z-10 rounded-full bg-primary-foreground/95 px-3.5 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm">
                      {formatPrice(prop.price, prop.transactionType)}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <MapPin size={12} />
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

                    {/* Hover arrow */}
                    <div className="absolute bottom-6 right-6 z-10 flex size-10 translate-y-2 items-center justify-center rounded-full bg-primary-foreground/95 text-primary opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/property:translate-y-0 group-hover/property:opacity-100">
                      <ArrowUpRight size={16} />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {properties.length === 0 && (
          <div className="flex items-center justify-center py-20 text-center">
            <p className="text-sm text-foreground-muted">Chưa có bất động sản nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
