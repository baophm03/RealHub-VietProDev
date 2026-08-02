import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import {
  prefetchGetApiPropertyIdQuery,
  prefetchGetApiPropertiesQuery,
  getGetApiPropertyIdQueryKey,
} from "@/lib/api/endpoints/properties";
import { prefetchGetApiFormSchemasQuery } from "@/lib/api/endpoints/dynamic-fields";
import { ListingDetailView } from "./_components/listing-detail-view";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();

  await prefetchGetApiPropertyIdQuery(queryClient, id);
  await prefetchGetApiFormSchemasQuery(queryClient, { entityType: "PROPERTY" } as any);

  // Read prefetched property data from cache to get propertyTypeId for similar properties
  const propertyData = queryClient.getQueryData(getGetApiPropertyIdQueryKey(id)) as any;
  const propertyTypeId = propertyData?.data?.propertyType?.id;
  await prefetchGetApiPropertiesQuery(
    queryClient,
    propertyTypeId ? { propertyTypeId, limit: "10" } : { limit: "10" } as any,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingDetailView />
    </HydrationBoundary>
  );
}
