import { getApiProperties, getApiPropertyMedia } from "@/lib/api/endpoints/properties";
import type { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import { formatPriceWithTransaction as formatPrice } from "@/utils";
import { TrendingUp, Users } from "lucide-react";

function extractFirstImageUrl(mediaRes: unknown): string | null {
  const raw = mediaRes as any;
  const items: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  if (items.length === 0) return null;
  const imageItem = items
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

export async function HeroFeatured() {
  let featured: Property | null = null;
  let featuredImageUrl: string | null = null;

  try {
    const propertiesRes = await getApiProperties({
      verificationStatus: "VERIFIED",
      publicationStatus: "PUBLIC",
      limit: "5",
    } as any);
    const properties = (propertiesRes as unknown as GetPropertiesResponse)?.data ?? [];
    featured = properties[0] ?? null;

    if (featured) {
      try {
        const mediaRes = await getApiPropertyMedia(featured.id);
        featuredImageUrl = extractFirstImageUrl(mediaRes);
      } catch {
        featuredImageUrl = null;
      }
    }
  } catch {
    // Keep defaults (null) — still renders empty state
  }

  const featuredLocation = featured
    ? [featured?.district?.name, featured?.province?.name].filter(Boolean).join(", ")
    : "";

  return (
    <div className="relative hidden flex-col gap-4 lg:flex">
      <div className="rounded-[1.5rem] bg-black/5 p-1.5 ring-1 ring-black/5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(1.5rem-0.375rem)]">
          {featured ? (
            <Link href={`/listings/${featured.propertyCode}`} className="group/featured relative block h-full">
              <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/featured:scale-105">
                {featuredImageUrl ? (
                  <img
                    src={featuredImageUrl}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface">
                    <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur-sm">
                  Nổi bật
                </span>
              </div>

              {/* Price tag */}
              <div className="absolute top-4 right-4 z-10 rounded-full bg-primary-foreground/95 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                {formatPrice(featured.price, featured.transactionType)}
              </div>

              {/* Content */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white/60">
                    {featuredLocation || "Đang cập nhật"}
                  </span>
                  <span className="font-serif text-xl font-semibold text-white">
                    {featured.title}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex h-full items-center justify-center bg-surface">
              <span className="text-xs text-foreground-muted">Chưa có bất động sản</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row — Double-Bezel mini cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[1.25rem] bg-black/5 p-1.5 ring-1 ring-black/5">
          <div className="flex flex-col gap-1.5 rounded-[calc(1.25rem-0.375rem)] bg-surface p-4">
            <TrendingUp size={16} className="text-primary" />
            <span className="font-serif text-2xl font-semibold tabular-nums tracking-tighter text-foreground">
              1,247
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
              BĐS đang bán
            </span>
          </div>
        </div>
        <div className="rounded-[1.25rem] bg-black/5 p-1.5 ring-1 ring-black/5">
          <div className="flex flex-col gap-1.5 rounded-[calc(1.25rem-0.375rem)] bg-surface p-4">
            <Users size={16} className="text-primary" />
            <span className="font-serif text-2xl font-semibold tabular-nums tracking-tighter text-foreground">
              38
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
              Agency tin dùng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
