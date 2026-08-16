import { setRequestLocale } from "next-intl/server";
import { getApiProperties, getApiPropertyTypes, getApiPropertyMedia } from "@/lib/api/endpoints/properties";
import { getApiLocations } from "@/lib/api/endpoints/locations";
import type { GetPropertiesResponse, Property } from "@/lib/api/types/properties";
import type { Location } from "@/lib/api/types/locations";
import { ListingsView } from "./_components/listings-view";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
};

function extractFirstImageUrl(mediaRes: unknown): string | null {
  const raw = mediaRes as any;
  const items: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  if (items.length === 0) return null;
  const imageItem = items
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

export default async function ListingsPage({ searchParams, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const transactionType = typeof sp.transactionType === "string" ? sp.transactionType : "";
  const provinceId = typeof sp.provinceId === "string" ? sp.provinceId : "";
  const typesRaw = typeof sp.types === "string" ? sp.types : "";
  const types = typesRaw ? typesRaw.split(",").filter(Boolean) : [];
  const minPrice = typeof sp.minPrice === "string" ? sp.minPrice : "";
  const maxPrice = typeof sp.maxPrice === "string" ? sp.maxPrice : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "newest";

  // Fetch property types + provinces in parallel (needed for filter UI + code→id mapping)
  const [propertyTypesRes, provincesRes] = await Promise.all([
    getApiPropertyTypes(),
    getApiLocations({ type: "PROVINCE" as any, limit: 100 } as any),
  ]);
  const propertyTypes = ((propertyTypesRes as unknown as { data?: PropertyType[] })?.data) || [];
  const provinces = ((provincesRes as unknown as { data?: Location[] })?.data) || [];

  // Map property type code → id for API filter
  const codeToId = Object.fromEntries(propertyTypes.map((t) => [t.code, t.id]));
  const selectedTypeIds = types.map((c) => codeToId[c]).filter(Boolean);

  // Build API params from searchParams
  const apiParams: Record<string, string> = {
    verificationStatus: "VERIFIED",
    publicationStatus: "PUBLIC",
  };
  if (transactionType) apiParams.transactionType = transactionType;
  if (provinceId) apiParams.provinceId = provinceId;
  if (selectedTypeIds.length === 1) apiParams.propertyTypeId = selectedTypeIds[0];
  if (minPrice) apiParams.minPrice = minPrice;
  if (maxPrice) apiParams.maxPrice = maxPrice;
  apiParams.limit = "100";

  const propertiesRes = await getApiProperties(apiParams as any);
  let properties: Property[] = ((propertiesRes as unknown as GetPropertiesResponse)?.data) || [];

  // Client-side filtering for multiple property types (by code)
  if (types.length > 1) {
    properties = properties.filter(
      (p) => p.propertyType && types.includes(p.propertyType.code),
    );
  }

  // Sorting
  switch (sort) {
    case "price-asc":
      properties = [...properties].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      break;
    case "price-desc":
      properties = [...properties].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      break;
    case "area-desc":
      properties = [...properties].sort((a, b) => (b.area || 0) - (a.area || 0));
      break;
    default:
      properties = [...properties].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }

  // Fetch media for each property in parallel (allSettled so 404s don't break)
  const mediaSettled = await Promise.allSettled(
    properties.map(async (p) => {
      const mediaRes = await getApiPropertyMedia(p.id);
      return { id: p.id, url: extractFirstImageUrl(mediaRes) };
    }),
  );
  const propertyImageMap = new Map(
    mediaSettled
      .filter((r): r is PromiseFulfilledResult<{ id: string; url: string | null }> => r.status === "fulfilled")
      .map((r) => [r.value.id, r.value.url]),
  );

  const priceMultiplier = transactionType === "RENT" ? 1000000 : 1000000000;
  const currentPriceFrom = minPrice ? String(Number(minPrice) / priceMultiplier) : "";
  const currentPriceTo = maxPrice ? String(Number(maxPrice) / priceMultiplier) : "";

  return (
    <ListingsView
      propertyTypes={propertyTypes}
      provinces={provinces}
      properties={properties}
      propertyImageMap={propertyImageMap}
      currentTransactionType={transactionType}
      currentProvinceId={provinceId}
      currentTypes={types}
      currentPriceFrom={currentPriceFrom}
      currentPriceTo={currentPriceTo}
      currentSort={sort}
    />
  );
}
