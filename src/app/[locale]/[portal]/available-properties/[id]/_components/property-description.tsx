"use client";

interface PropertyDescriptionProps {
  property?: any;
  title?: string;
}

export function PropertyDescription({ property, title = "Mô tả chi tiết" }: PropertyDescriptionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
        {title}
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
  );
}
