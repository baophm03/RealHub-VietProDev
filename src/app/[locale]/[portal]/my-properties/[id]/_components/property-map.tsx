"use client";

interface PropertyMapProps {
  property?: any;
  title?: string;
}

export function PropertyMap({ property, title = "Vị trí" }: PropertyMapProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
        {title}
      </h2>
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
