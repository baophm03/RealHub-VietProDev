import { getApiPropertyTypes } from "@/lib/api/endpoints/properties";
import { getApiLocations } from "@/lib/api/endpoints/locations";
import type { Location } from "@/lib/api/types/locations";
import { ListingsFilter } from "./listings-filter";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

interface ListingsFilterSectionProps {
  currentTransactionType: string;
  currentProvinceId: string;
  currentTypes: string[];
  currentPriceFrom: string;
  currentPriceTo: string;
}

export async function ListingsFilterSection({
  currentTransactionType,
  currentProvinceId,
  currentTypes,
  currentPriceFrom,
  currentPriceTo,
}: ListingsFilterSectionProps) {
  const [propertyTypesRes, provincesRes] = await Promise.all([
    getApiPropertyTypes(),
    getApiLocations({ type: "PROVINCE" as any, limit: 100 } as any),
  ]);

  const propertyTypes: PropertyType[] =
    ((propertyTypesRes as unknown as { data?: PropertyType[] })?.data) || [];
  const provinces: Location[] =
    ((provincesRes as unknown as { data?: Location[] })?.data) || [];

  return (
    <ListingsFilter
      propertyTypes={propertyTypes}
      provinces={provinces}
      currentTransactionType={currentTransactionType}
      currentProvinceId={currentProvinceId}
      currentTypes={currentTypes}
      currentPriceFrom={currentPriceFrom}
      currentPriceTo={currentPriceTo}
    />
  );
}
