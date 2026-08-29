import {
  findPropertyIcon,
  findFieldValue,
  getFieldsByGroupCode,
} from "@/constants/property-icons";

interface ListingSpecsProps {
  property: any;
  schemas: any[];
}

export function ListingSpecs({ property, schemas }: ListingSpecsProps) {
  const dynamicValues = property?.dynamicValuesJson as Record<string, unknown> | undefined;
  const areaNum = property?.area ?? 0;

  const bedrooms = findFieldValue(schemas, dynamicValues, ["bedroom", "beds", "phong_ngu", "phòng ngủ"]);
  const bathrooms = findFieldValue(schemas, dynamicValues, ["bathroom", "baths", "phong_tam", "phòng tắm"]);
  const legalStatus = findFieldValue(schemas, dynamicValues, ["legal", "phap_ly", "pháp lý", "ownership"]);

  const staticSpecs = [
    { icon: findPropertyIcon("diện tích").icon, label: "Diện tích", value: property?.area ? `${areaNum} m²` : "—" },
    { icon: findPropertyIcon("phòng ngủ").icon, label: "Phòng ngủ", value: bedrooms ?? "—" },
    { icon: findPropertyIcon("phòng tắm").icon, label: "Phòng tắm", value: bathrooms ?? "—" },
    { icon: findPropertyIcon("pháp lý").icon, label: "Pháp lý", value: legalStatus ?? "—" },
  ];

  const staticSpecLabels = new Set(["Diện tích", "Phòng ngủ", "Phòng tắm", "Pháp lý"]);
  const basicInfoFields = getFieldsByGroupCode(schemas, dynamicValues, "basic_info");
  const dynamicSpecs = basicInfoFields
    .filter((f) => !staticSpecLabels.has(f.label))
    .map((f) => ({ icon: findPropertyIcon(f.label).icon, label: f.label, value: f.value }));
  const specs = [...staticSpecs, ...dynamicSpecs];

  if (specs.length === 0) return null;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-muted rounded-xl border border-border">
      {specs.map((spec) => {
        const Icon = spec.icon;
        return (
          <div key={spec.label} className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{spec.label}</span>
            <div className="flex items-center gap-2">
              <Icon size={20} className="text-primary" />
              <span className="font-serif text-xl font-medium text-primary">{spec.value}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
