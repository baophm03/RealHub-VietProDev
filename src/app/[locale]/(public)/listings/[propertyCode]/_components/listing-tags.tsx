interface ListingTagsProps {
  property: any;
  title?: string;
}

export function ListingTags({ property, title = "Nhãn" }: ListingTagsProps) {
  const tags = Array.isArray(property?.tags) ? property.tags : [];
  if (tags.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span key={tag} className="bg-surface-muted text-xs px-3 py-1.5 rounded-lg text-foreground-muted">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
