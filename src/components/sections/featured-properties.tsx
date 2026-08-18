import { getApiProperties, getApiPropertyMedia } from "@/lib/api/endpoints/properties";
import type { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { FeaturedPropertiesCarousel } from "@/components/sections/featured-properties-carousel";

function extractFirstImageUrl(mediaRes: unknown): string | null {
  const raw = mediaRes as any;
  const items: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  if (items.length === 0) return null;
  const imageItem = items
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

export async function FeaturedProperties() {
  let properties: Property[] = [];
  let propertyImageMap = new Map<string, string | null>();

  try {
    const propertiesRes = await getApiProperties({
      verificationStatus: "VERIFIED",
      publicationStatus: "PUBLIC",
      limit: "40",
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

        {/* Carousel */}
        {properties.length > 0 && (
          <FeaturedPropertiesCarousel properties={properties} imageMap={propertyImageMap} />
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
