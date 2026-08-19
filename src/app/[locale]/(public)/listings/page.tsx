import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import {
  prefetchGetApiPropertiesQuery,
  prefetchGetApiPropertyTypesQuery,
  getGetApiPropertiesQueryKey,
  getGetApiPropertyTypesQueryKey,
} from "@/lib/api/endpoints/properties";
import {
  prefetchGetApiLocationsQuery,
  getGetApiLocationsQueryKey,
} from "@/lib/api/endpoints/locations";
import {
  prefetchGetApiFormSchemasQuery,
  getGetApiFormSchemasQueryKey,
} from "@/lib/api/endpoints/dynamic-fields";
import type { GetPropertiesResponse, Property, PropertyMedia } from "@/lib/api/types/properties";
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

function extractFirstImageUrlFromMedia(media: PropertyMedia[] | undefined): string | null {
  if (!media || media.length === 0) return null;
  const imageItem = media
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

function findFieldValue(
  schemas: any[],
  dynamicValues: Record<string, unknown> | undefined,
  patterns: string[],
): string | null {
  const directKeys = ["bed_room_count", "bedroom_count", "bedrooms", "beds", "phong_ngu"];
  const directKeysBath = ["pathroom_count", "bathroom_count", "bathrooms", "baths", "phong_tam"];
  const isBedroom = patterns.some((p) => p.includes("bed") || p.includes("ngu"));
  const isBathroom = patterns.some((p) => p.includes("bath") || p.includes("tam") || p.includes("path"));
  if (dynamicValues) {
    const keys = isBedroom ? directKeys : isBathroom ? directKeysBath : [];
    for (const k of keys) {
      const v = dynamicValues[k];
      if (v !== undefined && v !== null && v !== "") return String(v);
    }
  }
  for (const schema of schemas) {
    for (const f of schema.fields || []) {
      const field = f.field;
      if (!field) continue;
      const key = (field.fieldKey || "").toLowerCase();
      const label = (field.fieldLabel || "").toLowerCase();
      if (patterns.some((p) => key.includes(p) || label.includes(p))) {
        const rawValue = dynamicValues?.[field.fieldKey];
        if (rawValue === undefined || rawValue === null || rawValue === "") return null;
        if (field.options && Array.isArray(field.options)) {
          const opt = field.options.find((o: any) => o.value === String(rawValue));
          if (opt) return opt.label;
        }
        return String(rawValue);
      }
    }
  }
  return null;
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

  const queryClient = new QueryClient();

  const locationsParams = { type: "PROVINCE" as any, limit: 100 } as any;
  const schemasParams = { entityType: "PROPERTY" } as any;

  const apiParams: Record<string, string> = {
    verificationStatus: "VERIFIED",
    publicationStatus: "PUBLIC",
    include: "media",
  };
  if (transactionType) apiParams.transactionType = transactionType;
  if (provinceId) apiParams.provinceId = provinceId;
  if (minPrice) apiParams.minPrice = minPrice;
  if (maxPrice) apiParams.maxPrice = maxPrice;
  apiParams.limit = "100";

  await Promise.all([
    prefetchGetApiPropertyTypesQuery(queryClient),
    prefetchGetApiLocationsQuery(queryClient, locationsParams),
    prefetchGetApiFormSchemasQuery(queryClient, schemasParams),
    prefetchGetApiPropertiesQuery(queryClient, apiParams as any),
  ]);

  const propertyTypesRes = queryClient.getQueryData(getGetApiPropertyTypesQueryKey());
  const provincesRes = queryClient.getQueryData(getGetApiLocationsQueryKey(locationsParams));
  const schemaRes = queryClient.getQueryData(getGetApiFormSchemasQueryKey(schemasParams));
  const propertiesRes = queryClient.getQueryData(getGetApiPropertiesQueryKey(apiParams as any));

  const propertyTypes = ((propertyTypesRes as unknown as { data?: PropertyType[] })?.data) || [];
  const provinces = ((provincesRes as unknown as { data?: Location[] })?.data) || [];
  const schemas = ((schemaRes as any)?.data as any[]) || [];
  let properties: Property[] = ((propertiesRes as unknown as GetPropertiesResponse)?.data) || [];

  if (types.length > 0) {
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

  const propertyImageMap = new Map<string, string | null>();
  for (const p of properties) {
    propertyImageMap.set(p.id, extractFirstImageUrlFromMedia(p.media));
  }

  const bedroomsMap = new Map<string, string | null>();
  const bathroomsMap = new Map<string, string | null>();
  for (const p of properties) {
    const propertyTypeId = p.propertyType?.id;
    const relevantSchemas = schemas.filter(
      (s) => s.propertyTypeId === null || s.propertyTypeId === undefined || s.propertyTypeId === propertyTypeId,
    );
    const dynamicValues = (p as any)?.dynamicValuesJson as Record<string, unknown> | undefined;
    bedroomsMap.set(p.id, findFieldValue(relevantSchemas, dynamicValues, ["bedroom", "beds", "bed_room", "phong_ngu", "phòng ngủ"]));
    bathroomsMap.set(p.id, findFieldValue(relevantSchemas, dynamicValues, ["bathroom", "baths", "pathroom", "phong_tam", "phòng tắm"]));
  }

  const priceMultiplier = transactionType === "RENT" ? 1000000 : 1000000000;
  const currentPriceFrom = minPrice ? String(Number(minPrice) / priceMultiplier) : "";
  const currentPriceTo = maxPrice ? String(Number(maxPrice) / priceMultiplier) : "";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingsView
        propertyTypes={propertyTypes}
        provinces={provinces}
        properties={properties}
        propertyImageMap={propertyImageMap}
        bedroomsMap={bedroomsMap}
        bathroomsMap={bathroomsMap}
        currentTransactionType={transactionType}
        currentProvinceId={provinceId}
        currentTypes={types}
        currentPriceFrom={currentPriceFrom}
        currentPriceTo={currentPriceTo}
        currentSort={sort}
      />
    </HydrationBoundary>
  );
}
