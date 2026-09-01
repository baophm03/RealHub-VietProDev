import { getApiProperties, getApiPropertyMedia } from "@/lib/api/endpoints/properties";
import type { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { FeaturedPropertiesCarousel } from "@/components/shared/featured-properties-carousel";
import { extractFirstImageUrlFromMedia } from "@/components/shared/property-utils";

interface FeaturedPropertiesSectionProps {
  transactionType: "SALE" | "RENT";
  eyebrow: string;
  title: string;
  description: string;
  sectionClassName?: string;
}

export async function FeaturedPropertiesSection({
  transactionType,
  eyebrow,
  title,
  description,
  sectionClassName = "bg-white",
}: FeaturedPropertiesSectionProps) {
  let properties: Property[] = [];
  let propertyImageMap = new Map<string, string | null>();

  try {
    const propertiesRes = await getApiProperties({
      verificationStatus: "VERIFIED",
      publicationStatus: "PUBLIC",
      transactionType,
      limit: "20",
    } as any);
    properties = (propertiesRes as unknown as GetPropertiesResponse)?.data ?? [];

    const mediaSettled = await Promise.allSettled(
      properties.map(async (p) => {
        const mediaRes = await getApiPropertyMedia(p.id);
        const raw = mediaRes as any;
        const items: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        return { id: p.id, url: extractFirstImageUrlFromMedia(items) };
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
    <section className={`py-16 md:py-24 ${sectionClassName}`}>
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter text-black md:text-5xl">
              {title}
            </h2>
            <p className="max-w-[48ch] text-sm leading-relaxed text-foreground-muted">
              {description}
            </p>
          </div>
          <Link
            href="/listings"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            Xem tất cả
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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
