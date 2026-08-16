import { House, Building2, Warehouse, Map, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PropertyCategory {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
  types: string;
}

export const propertyCategories: PropertyCategory[] = [
  {
    icon: House,
    label: "Căn hộ",
    desc: "Chung cư, studio, penthouse",
    types: "APARTMENT",
    href: "/listings?types=APARTMENT",
  },
  {
    icon: Building2,
    label: "Biệt thự",
    desc: "Biệt thự đơn lập, song lập",
    types: "VILLA",
    href: "/listings?types=VILLA",
  },
  {
    icon: Warehouse,
    label: "Nhà phố",
    desc: "Nhà phố, nhà mặt tiền",
    types: "HOUSE,SHOPHOUSE",
    href: "/listings?types=HOUSE,SHOPHOUSE",
  },
  {
    icon: Map,
    label: "Đất nền",
    desc: "Đất thổ cư, đất dự án",
    types: "LAND",
    href: "/listings?types=LAND",
  },
  {
    icon: Store,
    label: "Mặt bằng",
    desc: "Văn phòng, shop, kho xưởng",
    types: "OFFICE,WAREHOUSE,SHOP",
    href: "/listings?types=OFFICE,WAREHOUSE,SHOP",
  },
];
