import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  formatPriceWithTransaction as formatPrice,
  formatPricePerSqm,
} from "@/utils";
import type { Property } from "@/lib/api/types/properties";
import type { Location } from "@/lib/api/types/locations";
import { ListingsFilter } from "./listings-filter";
import { ListingsToolbar } from "./listings-toolbar";

type PropertyType = {
  id: string;
  name: string;
  code: string;
  group?: string | null;
};

const statusBadge: Record<string, { label: string; class: string }> = {
  AVAILABLE: { label: "Sẵn có", class: "bg-accent-green text-accent-green-text" },
  RESERVED: { label: "Đặt cọc", class: "bg-accent-yellow text-accent-yellow-text" },
  SOLD: { label: "Đã bán", class: "bg-accent-red text-accent-red-text" },
  RENTED: { label: "Đã thuê", class: "bg-accent-blue text-accent-blue-text" },
  OFF_MARKET: { label: "Ngừng bán", class: "bg-surface-muted text-foreground-muted" },
};

const txLabel: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
  TRANSFER: "Chuyển nhượng",
  INVESTMENT: "Đầu tư",
};

interface ListingsViewProps {
  propertyTypes: PropertyType[];
  provinces: Location[];
  properties: Property[];
  propertyImageMap: Map<string, string | null>;
  currentTransactionType: string;
  currentProvinceId: string;
  currentTypes: string[];
  currentPriceFrom: string;
  currentPriceTo: string;
  currentSort: string;
}

export function ListingsView({
  propertyTypes,
  provinces,
  properties,
  propertyImageMap,
  currentTransactionType,
  currentProvinceId,
  currentTypes,
  currentPriceFrom,
  currentPriceTo,
  currentSort,
}: ListingsViewProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-8">
      <div className="flex flex-1 gap-6 flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <ListingsFilter
            propertyTypes={propertyTypes}
            provinces={provinces}
            currentTransactionType={currentTransactionType}
            currentProvinceId={currentProvinceId}
            currentTypes={currentTypes}
            currentPriceFrom={currentPriceFrom}
            currentPriceTo={currentPriceTo}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          <ListingsToolbar currentSort={currentSort} resultCount={properties.length} />

          {/* Property Grid */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-base text-foreground-muted">Không tìm thấy BĐS phù hợp bộ lọc.</p>
              <Link href="/listings" className="text-sm font-medium text-primary hover:underline">
                Xóa tất cả bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => {
                const badge = statusBadge[property.businessStatus ?? ""];
                const imageUrl = propertyImageMap.get(property.id) ?? null;
                return (
                  <Link
                    key={property.id}
                    href={`/listings/${property.id}`}
                    className="group flex flex-col bg-surface rounded-xl border border-border overflow-hidden hover:border-primary transition-colors shadow-sm hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          alt={property.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                          <span className="text-xs text-foreground-muted">Không có hình ảnh</span>
                        </div>
                      )}
                      {badge && (
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm ${badge.class}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="flex items-center gap-1 bg-surface/90 backdrop-blur-sm text-primary text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                          {txLabel[property.transactionType] ?? property.transactionType}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-lg font-medium text-primary truncate pr-2 group-hover:text-primary/80 transition-colors">
                          {property.title}
                        </h3>
                      </div>

                      <p className="text-sm text-foreground-muted flex items-center gap-1">
                        <MapPin size={16} />
                        <span>
                          {property?.district?.name ?? "Đang cập nhật"},{" "}
                          {property?.province?.name ?? "Đang cập nhật"}
                        </span>
                      </p>

                      {property.propertyType?.name && (
                        <div className="flex gap-2 mt-1">
                          <span className="bg-surface-muted text-xs px-2 py-1 rounded text-foreground-muted">
                            {property.propertyType.name}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-end mt-auto pt-4 border-t border-border">
                        <div>
                          <div className="font-serif text-2xl font-bold text-primary">
                            {formatPrice(property.price, property.transactionType)}
                          </div>
                          <div className="text-xs text-foreground-muted">
                            {formatPricePerSqm(property.price, property.area)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
