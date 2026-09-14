import type { Property, PropertyMedia } from "@/lib/api/types/properties";

// ── Constants ─────────────────────────────────────────────

export const propertyStatusBadgeMap: Record<string, { className: string }> = {
  AVAILABLE: { className: "bg-accent-green text-accent-green-text" },
  RESERVED: { className: "bg-accent-yellow text-accent-yellow-text" },
  SOLD: { className: "bg-accent-red text-accent-red-text" },
  RENTED: { className: "bg-accent-blue text-accent-blue-text" },
  OFF_MARKET: { className: "bg-surface-muted text-foreground-muted" },
};

export const transactionLabelMap: Record<string, string> = {
  SALE: "enums.transaction.SALE",
  RENT: "enums.transaction.RENT",
  TRANSFER: "enums.transaction.TRANSFER",
  INVESTMENT: "enums.transaction.INVESTMENT",
};

export const propertyBadgeBase =
  "inline-flex h-6 min-w-[3.25rem] items-center justify-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-md shadow-sm whitespace-nowrap";

export const BEDROOM_KEYS = ["bed_room_count", "bedroom_count", "bedrooms", "beds", "phong_ngu"];
export const BATHROOM_KEYS = ["bathroom_count", "bathrooms", "baths", "pathroom_count", "phong_tam"];

// ── Pure helpers (safe for both server & client) ─────────

export function pickDynamicValue(
  dynamicValues: Record<string, unknown> | null | undefined,
  keys: string[],
): string | null {
  if (!dynamicValues) return null;
  for (const k of keys) {
    const v = dynamicValues[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return null;
}

export function extractFirstImageUrlFromMedia(media: PropertyMedia[] | undefined): string | null {
  if (!media || media.length === 0) return null;
  const imageItem = media
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

export function getPropertyLocation(prop: Property): string {
  const parts = [prop?.district?.name, prop?.province?.name].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Đang cập nhật";
}

export function getPropertyBedrooms(prop: Property): string | null {
  if (prop.bedrooms != null) return String(prop.bedrooms);
  const dynamicValues = (prop as any)?.dynamicValuesJson as Record<string, unknown> | undefined;
  return pickDynamicValue(dynamicValues, BEDROOM_KEYS);
}

export function getPropertyBathrooms(prop: Property): string | null {
  if (prop.bathrooms != null) return String(prop.bathrooms);
  const dynamicValues = (prop as any)?.dynamicValuesJson as Record<string, unknown> | undefined;
  return pickDynamicValue(dynamicValues, BATHROOM_KEYS);
}
