import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { prefetchGetApiPropertiesQuery, prefetchGetApiPropertyTypesQuery } from "@/lib/api/endpoints/properties";
import { prefetchGetApiLocationsQuery } from "@/lib/api/endpoints/locations";
import { ListingsView } from "./_components/listings-view";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
};

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

  const queryClient = new QueryClient();

  await prefetchGetApiPropertyTypesQuery(queryClient);
  await prefetchGetApiLocationsQuery(queryClient, { type: "PROVINCE" as any, limit: 100 } as any);

  const apiParams: Record<string, string> = {};
  if (transactionType) apiParams.transactionType = transactionType;
  if (provinceId) apiParams.provinceId = provinceId;
  if (types.length === 1) apiParams.propertyTypeId = types[0];
  if (minPrice) apiParams.minPrice = minPrice;
  if (maxPrice) apiParams.maxPrice = maxPrice;
  apiParams.limit = "100";

  await prefetchGetApiPropertiesQuery(queryClient, apiParams as any);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingsView />
    </HydrationBoundary>
  );
}
