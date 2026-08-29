"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import {
  findPropertyIcon,
  getFieldsByGroupCode,
} from "@/constants/property-icons";

export interface PropertyHighlight {
  icon?: any;
  title: string;
  desc: string;
}

interface PropertyHighlightsProps {
  property?: any;
  schemas?: any[];
  title?: string;
}

export function PropertyHighlights({ property, schemas = [], title = "Đặc điểm nổi bật" }: PropertyHighlightsProps) {
  const highlights = useMemo<PropertyHighlight[]>(() => {
    const dynamicValues = property?.dynamicValuesJson as Record<string, unknown> | undefined;
    const specialFields = getFieldsByGroupCode(schemas, dynamicValues, "special");
    return specialFields.map((f) => ({
      icon: findPropertyIcon(f.label).icon,
      title: f.label,
      desc: f.value,
    }));
  }, [property, schemas]);

  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-medium tracking-tight text-foreground border-b border-border pb-3">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {highlights.map((item) => {
          const Icon = item.icon ?? Star;
          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/20 hover:shadow-[0_4px_16px_-8px_rgba(45,95,63,0.12)]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon size={20} className="text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-foreground-muted">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
