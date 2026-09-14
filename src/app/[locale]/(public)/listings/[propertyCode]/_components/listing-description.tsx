import { getTranslations } from "next-intl/server";

interface ListingDescriptionProps {
  property: any;
  title?: string;
}

export async function ListingDescription({ property, title }: ListingDescriptionProps) {
  const t = await getTranslations("public.listingDetail");
  const resolvedTitle = title ?? t("description");
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">{resolvedTitle}</h2>
      {property?.description ? (
        <div
          className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg prose-img:my-4 text-foreground-muted"
          dangerouslySetInnerHTML={{ __html: property.description }}
        />
      ) : (
        <p className="text-base leading-relaxed text-foreground-muted">
          {t("noDescription")}
        </p>
      )}
    </section>
  );
}
