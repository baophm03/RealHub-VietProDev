"use client";

import { useEffect, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetApiLocations } from "@/lib/api/endpoints/locations";
import type { Location } from "@/lib/api/types/locations";

interface LocationSelectProps {
  provinceId?: string | null;
  wardId?: string | null;
  onProvinceChange: (id: string | null) => void;
  onWardChange: (id: string | null) => void;
  provincePlaceholder?: string;
  wardPlaceholder?: string;
  provinceLabel?: string;
  wardLabel?: string;
  provinceError?: string;
  wardError?: string;
  disabled?: boolean;
}

/**
 * Reusable province + ward dropdown selector.
 * Fetches provinces via GET /api/locations?type=PROVINCE
 * Fetches wards via GET /api/locations?type=WARD&parentId=<provinceId>
 *
 * When province changes, ward is automatically reset.
 */
export function LocationSelect({
  provinceId,
  wardId,
  onProvinceChange,
  onWardChange,
  provincePlaceholder = "Chọn tỉnh/thành phố",
  wardPlaceholder = "Chọn phường/xã",
  provinceLabel,
  wardLabel,
  provinceError,
  wardError,
  disabled = false,
}: LocationSelectProps) {
  // Fetch provinces
  const { data: provincesData, isLoading: provincesLoading } = useGetApiLocations({
    type: "PROVINCE",
    limit: 100,
  });
  const provinces = useMemo(
    () => ((provincesData as unknown as { data?: Location[] })?.data) ?? [],
    [provincesData],
  );

  // Fetch wards under selected province
  const { data: wardsData, isLoading: wardsLoading } = useGetApiLocations(
    provinceId ? { type: "WARD", parentId: provinceId, limit: 100 } : undefined,
  );
  const wards = useMemo(
    () => ((wardsData as unknown as { data?: Location[] })?.data) ?? [],
    [wardsData],
  );

  // Reset ward when province changes
  useEffect(() => {
    if (wardId && provinceId) {
      const wardBelongsToProvince = wards.some((w) => w.id === wardId);
      if (!wardBelongsToProvince && wards.length > 0) {
        onWardChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId, wards]);

  return (
    <>
      {provinceLabel && (
        <label className="text-[13px] font-medium">{provinceLabel}</label>
      )}
      <Select
        value={provinceId ?? ""}
        disabled={disabled}
        onValueChange={(v) => {
          onProvinceChange(v as string);
          onWardChange(null);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={provincesLoading ? "Đang tải..." : provincePlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((loc) => (
            <SelectItem key={loc.id} value={loc.id} label={loc.name}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {provinceError && (
        <p className="text-xs text-accent-red-text">{provinceError}</p>
      )}

      {wardLabel && (
        <label className="text-[13px] font-medium">{wardLabel}</label>
      )}
      <Select
        value={wardId ?? ""}
        disabled={disabled || !provinceId || wardsLoading}
        onValueChange={(v) => onWardChange(v as string)}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              !provinceId
                ? wardPlaceholder
                : wardsLoading
                  ? "Đang tải..."
                  : wardPlaceholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          {wards.map((loc) => (
            <SelectItem key={loc.id} value={loc.id} label={loc.name}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {wardError && (
        <p className="text-xs text-accent-red-text">{wardError}</p>
      )}
    </>
  );
}
