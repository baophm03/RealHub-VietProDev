import { Star } from "lucide-react";
import {
  findPropertyIcon,
  getFieldsByGroupCode,
} from "@/constants/property-icons";

interface ListingHighlightsProps {
  property: any;
  schemas: any[];
  title?: string;
}

export function ListingHighlights({ property, schemas, title = "Đặc điểm nổi bật" }: ListingHighlightsProps) {
  const dynamicValues = property?.dynamicValuesJson as Record<string, unknown> | undefined;
  const specialFields = getFieldsByGroupCode(schemas, dynamicValues, "special");
  const highlights = specialFields.map((f) => ({
    icon: findPropertyIcon(f.label).icon,
    title: f.label,
    desc: f.value,
  }));

  if (highlights.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl font-semibold text-primary border-b border-border pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((item) => {
          const Icon = item.icon ?? Star;
          return (
            <div key={item.title} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-border">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-serif text-base font-medium text-primary">{item.title}</h3>
                <p className="text-xs text-foreground-muted">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
