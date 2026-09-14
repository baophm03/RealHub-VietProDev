import { getTranslations } from "next-intl/server";

interface ListingMapProps {
  property: any;
  title?: string;
}

export async function ListingMap({ property, title }: ListingMapProps) {
  const t = await getTranslations("public.listingDetail");
  const resolvedTitle = title ?? t("location");
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">{resolvedTitle}</h2>
      <iframe
        width="100%"
        height="400"
        className="border-0"
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${property?.latitude || 0},${property?.longitude || 0}&z=15&output=embed`}
      />
    </section>
  );
}
