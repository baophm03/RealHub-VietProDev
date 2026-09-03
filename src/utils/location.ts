interface LocationPart {
  name?: string | null;
}

interface LocationInput {
  street?: LocationPart | null;
  ward?: LocationPart | null;
  district?: LocationPart | null;
  province?: LocationPart | null;
  addressPublic?: string | null;
}

export function formatLocation(p: LocationInput): string {
  const parts = [
    p.addressPublic,
    p.street?.name,
    p.ward?.name,
    p.district?.name,
    p.province?.name,
  ]
    .filter((x): x is string => Boolean(x))
    .map((x) => x.trim())
    .filter(Boolean);

  if (parts.length === 0) return "-";
  return parts.join(", ");
}

export function formatLocationShort(p: LocationInput, fallback = "-"): string {
  const parts = [p.district?.name, p.province?.name]
    .filter((x): x is string => Boolean(x))
    .map((x) => x.trim())
    .filter(Boolean);

  if (parts.length === 0) return fallback;
  return parts.join(", ");
}
