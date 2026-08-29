import {
  Star, ShieldCheck, Ruler, Bed, Bath, MapPin, Compass, Building2, Trees, Car,
  Zap, Droplet, Wind, Sun, Waves, Dumbbell, Utensils, Coffee, ShoppingBag,
  GraduationCap, HeartPulse, Lock, ArrowUpDown, Sofa, Mountain, TreePalm, TreeDeciduous,
  Fish, Flame, Snowflake, Wifi, Tv, WashingMachine, Refrigerator,
  DoorOpen, Fence, Bike, Bus, Cigarette,
} from "lucide-react";

export const propertyIconMap: { patterns: string[]; icon: any }[] = [
  { patterns: ["ban công", "balcony", "ban cong", "ban_cong"], icon: Building2 },
  { patterns: ["sân vườn", "garden", "yard", "san vuon", "san_vuon"], icon: Trees },
  { patterns: ["sân thượng", "rooftop", "san thuong", "san_thuong"], icon: Building2 },
  { patterns: ["chỗ để xe", "garage", "parking", "cho de xe", "cho_de_xe", "bãi đỗ", "bai do"], icon: Car },
  { patterns: ["đỗ xe", "do xe", "do_xe", "đậu xe", "dau xe", "dau_xe"], icon: Car },
  { patterns: ["xe máy", "bike", "xe may", "xe_may"], icon: Bike },
  { patterns: ["thang máy", "elevator", "thang may", "thang_may"], icon: ArrowUpDown },
  { patterns: ["cửa", "door", "cua"], icon: DoorOpen },
  { patterns: ["hàng rào", "fence", "hang rao", "hang_rao"], icon: Fence },
  { patterns: ["nội thất", "furniture", "noi that", "noi_that"], icon: Sofa },
  { patterns: ["sofa", "phòng khách", "living room", "phong khach", "phong_khach"], icon: Sofa },
  { patterns: ["phòng ngủ", "bedroom", "phong ngu", "phong_ngu", "beds"], icon: Bed },
  { patterns: ["phòng tắm", "bathroom", "phong tam", "phong_tam", "baths"], icon: Bath },
  { patterns: ["phòng bếp", "kitchen", "phong bep", "phong_bep"], icon: Utensils },
  { patterns: ["nhà hàng", "restaurant", "nha hang", "nha_hang"], icon: Utensils },
  { patterns: ["cafe", "cà phê", "ca phe", "ca_phe", "coffee"], icon: Coffee },
  { patterns: ["mua sắm", "shopping", "mua sam", "mua_sam", "siêu thị", "supermarket", "sieu thi", "sieu_thi"], icon: ShoppingBag },
  { patterns: ["trường học", "school", "truong hoc", "truong_hoc", "giáo dục", "education", "giao duc", "giao_duc"], icon: GraduationCap },
  { patterns: ["bệnh viện", "hospital", "benh vien", "benh_vien", "y tế", "clinic", "y te", "y_te", "phòng khám", "phong kham"], icon: HeartPulse },
  { patterns: ["hồ bơi", "pool", "ho boi", "ho_boi", "swimming"], icon: Waves },
  { patterns: ["gym", "thể dục", "fitness", "the duc", "the_duc", "thể hình"], icon: Dumbbell },
  { patterns: ["công viên", "park", "cong vien", "cong_vien", "vườn hoa", "vuon hoa", "vuon_hoa"], icon: TreeDeciduous },
  { patterns: ["biển", "beach", "bien", "ven biển", "ven_bien"], icon: Waves },
  { patterns: ["cọ", "palm", "co"], icon: TreePalm },
  { patterns: ["núi", "mountain", "view núi", "nhin nui", "nhin_nui"], icon: Mountain },
  { patterns: ["thủy sinh", "aquarium", "thuy sinh", "thuy_sinh"], icon: Fish },
  { patterns: ["an ninh", "security", "an_ninh", "bảo vệ", "bao ve", "bao_ve", "camera"], icon: Lock },
  { patterns: ["lửa", "fireplace", "lua", "bếp lò", "bep lo", "bep_lo"], icon: Flame },
  { patterns: ["điều hòa", "air conditioner", "dieu hoa", "dieu_hoa", "ac"], icon: Snowflake },
  { patterns: ["thông gió", "ventilation", "thong gio", "thong_gio"], icon: Wind },
  { patterns: ["ánh sáng", "light", "anh sang", "anh_sang", "nắng", "window", "cửa sổ", "cua so", "cua_so"], icon: Sun },
  { patterns: ["wifi", "wi-fi", "internet", "mạng", "mang"], icon: Wifi },
  { patterns: ["tv", "truyền hình", "truyen hinh", "truyen_hinh", "truyền hình cáp"], icon: Tv },
  { patterns: ["máy giặt", "washing machine", "may giat", "may_giat"], icon: WashingMachine },
  { patterns: ["tủ lạnh", "fridge", "tu lanh", "tu_lanh", "refrigerator"], icon: Refrigerator },
  { patterns: ["hút thuốc", "smoking", "smoke", "thuoc la", "thuoc_la"], icon: Cigarette },
  { patterns: ["di chuyển", "transport", "di chuyen", "di_chuyen", "transportation"], icon: Bus },
  { patterns: ["pháp lý", "legal", "phap ly", "phap_ly", "ownership"], icon: ShieldCheck },
  { patterns: ["diện tích", "area", "dien tich", "dien_tich"], icon: Ruler },
  { patterns: ["hướng", "direction", "huong"], icon: Compass },
  { patterns: ["mặt tiền", "facade", "mat tien", "mat_tien"], icon: Building2 },
  { patterns: ["vị trí", "location", "vi tri", "vi_tri"], icon: MapPin },
  { patterns: ["đường", "road", "duong"], icon: MapPin },
  { patterns: ["tầng", "floor", "tang"], icon: Building2 },
  { patterns: ["năm xây", "year", "nam xay", "nam_xay"], icon: Ruler },
  { patterns: ["điện", "electric", "dien"], icon: Zap },
  { patterns: ["nước", "water", "nuoc"], icon: Droplet },
  { patterns: ["phòng", "room", "phong"], icon: Bed },
];

export function findPropertyIcon(label: string): { icon: any } {
  const lower = label.toLowerCase();
  for (const entry of propertyIconMap) {
    if (entry.patterns.some((p) => lower.includes(p))) {
      return { icon: entry.icon };
    }
  }
  return { icon: Star };
}

export function findFieldValue(
  schemas: any[],
  dynamicValues: Record<string, unknown> | undefined,
  patterns: string[],
): string | null {
  for (const schema of schemas) {
    for (const f of (schema.fields || [])) {
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

export function getFieldsByGroupCode(
  schemas: any[],
  dynamicValues: Record<string, unknown> | undefined,
  code: string,
): { key: string; label: string; value: string }[] {
  const result: { key: string; label: string; value: string }[] = [];
  for (const schema of schemas) {
    for (const f of (schema.fields || [])) {
      const field = f.field;
      if (!field) continue;
      if (f.group?.code === code) {
        const rawValue = dynamicValues?.[field.fieldKey];
        if (rawValue === undefined || rawValue === null || rawValue === "") continue;
        let displayValue = String(rawValue);
        if (field.options && Array.isArray(field.options)) {
          const opt = field.options.find((o: any) => o.value === String(rawValue));
          if (opt) displayValue = opt.label;
        }
        result.push({ key: field.fieldKey, label: field.fieldLabel, value: displayValue });
      }
    }
  }
  return result;
}
