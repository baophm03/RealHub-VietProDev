import { House, Building2, Warehouse, Map, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PropertyCategory {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
  types: string;
  color: string;
  colorOnDark: string;
}

export const propertyCategories: PropertyCategory[] = [
  {
    icon: House,
    label: "Căn hộ",
    desc: "Chung cư, studio, penthouse",
    types: "APARTMENT",
    href: "/listings?types=APARTMENT",
    color: "text-blue-600",
    colorOnDark: "text-blue-400",
  },
  {
    icon: Building2,
    label: "Biệt thự",
    desc: "Biệt thự đơn lập, song lập",
    types: "VILLA",
    href: "/listings?types=VILLA",
    color: "text-violet-600",
    colorOnDark: "text-violet-400",
  },
  {
    icon: Warehouse,
    label: "Nhà phố",
    desc: "Nhà phố, nhà mặt tiền",
    types: "HOUSE,SHOPHOUSE",
    href: "/listings?types=HOUSE,SHOPHOUSE",
    color: "text-emerald-600",
    colorOnDark: "text-emerald-400",
  },
  {
    icon: Map,
    label: "Đất nền",
    desc: "Đất thổ cư, đất dự án",
    types: "LAND",
    href: "/listings?types=LAND",
    color: "text-amber-600",
    colorOnDark: "text-amber-400",
  },
  {
    icon: Store,
    label: "Mặt bằng",
    desc: "Văn phòng, shop, kho xưởng",
    types: "OFFICE,WAREHOUSE,SHOP",
    href: "/listings?types=OFFICE,WAREHOUSE,SHOP",
    color: "text-rose-600",
    colorOnDark: "text-rose-400",
  },
];
