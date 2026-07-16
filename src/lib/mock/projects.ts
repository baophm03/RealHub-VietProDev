export interface MockProject {
  id: string;
  slug: string;
  name: string;
  location: string;
  investor: string;
  priceRange: string;
  scale: string;
  propertyTypes: string[];
  handover: string;
  status: "PLANNING" | "OPENING" | "CONSTRUCTION" | "COMPLETED";
  image: string;
  description: string;
  amenities: string[];
  gallery: string[];
}

export const mockProjects: MockProject[] = [
  {
    id: "prj-001",
    slug: "vinhomes-grand-park",
    name: "Vinhomes Grand Park",
    location: "Long Thạnh Mỹ, TP. Thủ Đức, TP.HCM",
    investor: "Vinhomes",
    priceRange: "2.8 - 12 tỷ",
    scale: "44.000 căn",
    propertyTypes: ["Căn hộ", "Biệt thự", "Shophouse"],
    handover: "2025 - 2027",
    status: "OPENING",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    description:
      "Vinhomes Grand Park là khu đô thị sinh thái thông minh tại TP. Thủ Đức với quy mô 271.8 ha. Dự án được đầu tư bởi Vingroup với đầy đủ tiện ích: trường học, bệnh viện, công viên, trung tâm thương mại.",
    amenities: [
      "Trường học quốc tế Vinschool",
      "Bệnh viện Vinmec",
      "Công viên chủ đề 36ha",
      "Trung tâm thương mại",
      "Hồ bơi",
      "Gym",
      "Sân tennis",
      "Đường đi bộ ven hồ",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    ],
  },
  {
    id: "prj-002",
    slug: "masteri-thao-dien",
    name: "Masteri Thảo Điền",
    location: "Thảo Điền, TP. Thủ Đức, TP.HCM",
    investor: "Masterise Homes",
    priceRange: "4.5 - 15 tỷ",
    scale: "2.300 căn",
    propertyTypes: ["Căn hộ", "Officetel"],
    handover: "2025",
    status: "CONSTRUCTION",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    description:
      "Masteri Thảo Điền là dự án căn hộ hạng sang tại vị trí đắc địa bậc nhất Thảo Điền. Với kiến trúc xanh độc đáo và hệ tiện ích đẳng cấp quốc tế, dự án mang đến trải nghiệm sống thượng lưu.",
    amenities: [
      "View sông Sài Gòn",
      "Hồ bơi tràn bờ",
      "Phòng gym 5 sao",
      "Spa cao cấp",
      "Trung tâm thương mại",
      "Khu vui chơi trẻ em",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
  },
  {
    id: "prj-003",
    slug: "swan-park",
    name: "Swan Park",
    location: "Đại Phước, Nhơn Trạch, Đồng Nai",
    investor: "Nam Long Group",
    priceRange: "12 - 35 tỷ",
    scale: "1.120 căn",
    propertyTypes: ["Biệt thự", "Nhà phố"],
    handover: "Đã bàn giao",
    status: "COMPLETED",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
    description:
      "Swan Park là khu đô thị sinh thái ven sông với hồ nước trung tâm 8ha và không gian sống xanh độc đáo. Dự án mang đến phong cách sống resort ngay tại Đồng Nai, cách TP.HCM chỉ 25 phút di chuyển.",
    amenities: [
      "Hồ sinh thái 8ha",
      "Sân golf",
      "Công viên",
      "Khu vực BBQ",
      "An ninh 24/7",
      "Trung tâm thương mại",
      "Trường học quốc tế",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
    ],
  },
  {
    id: "prj-004",
    slug: "sunrise-city",
    name: "Sunrise City",
    location: "Tân Hưng, Quận 7, TP.HCM",
    investor: "Novaland",
    priceRange: "3.5 - 8 tỷ",
    scale: "1.800 căn",
    propertyTypes: ["Căn hộ"],
    handover: "Đã bàn giao",
    status: "COMPLETED",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80",
    description:
      "Sunrise City — Tổ hợp căn hộ cao cấp với đường đi bộ trên cao Skywalk 500m kết nối 6 tòa tháp. Vị trí chiến lược trên mặt tiền đường Nguyễn Hữu Thọ, kết nối thuận tiện Phú Mỹ Hưng.",
    amenities: [
      "Hồ bơi resort",
      "Phòng gym",
      "Skywalk 500m",
      "Công viên nội khu",
      "Trung tâm thương mại",
      "Trường học",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0b26?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809872374-9ddf87e1f1d1?w=1200&q=80",
    ],
  },
  {
    id: "prj-005",
    slug: "the-global-city",
    name: "The Global City",
    location: "An Phú, TP. Thủ Đức, TP.HCM",
    investor: "Masterise Homes",
    priceRange: "8.5 - 28 tỷ",
    scale: "1.950 căn",
    propertyTypes: ["Căn hộ", "Shophouse"],
    handover: "2026 - 2028",
    status: "OPENING",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
    description:
      "The Global City là khu đô thị phức hợp theo mô hình 'Downtown' thu nhỏ, tích hợp kênh đào nhân tạo và hệ tiện ích đẳng cấp quốc tế. Dự án mở ra chuẩn sống mới cho cộng đồng tinh hoa.",
    amenities: [
      "Kênh đào nhân tạo",
      "Trung tâm thương mại",
      "Công viên",
      "Trường học quốc tế",
      "Bệnh viện",
      "Khu vui chơi giải trí",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809872374-9ddf87e1f1d1?w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    ],
  },
  {
    id: "prj-006",
    slug: "aqua-city",
    name: "Aqua City",
    location: "Long Hưng, Biên Hòa, Đồng Nai",
    investor: "Novaland",
    priceRange: "5.5 - 22 tỷ",
    scale: "6.800 căn",
    propertyTypes: ["Biệt thự", "Nhà phố", "Shophouse"],
    handover: "2025 - 2027",
    status: "CONSTRUCTION",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    description:
      "Aqua City — Thành phố sinh thái ven sông Đồng Nai với quy mô 3.850 ha. Dự án kiến tạo chuẩn sống wellness với không gian xanh 360° và hệ tiện ích đẳng cấp quốc tế.",
    amenities: [
      "Mặt nước 32ha",
      "Bến du thuyền",
      "Sân golf",
      "Trường học quốc tế",
      "Bệnh viện",
      "Trung tâm thể thao",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=1200&q=80",
    ],
  },
];

export const mockProjectCategories = [
  "Tất cả",
  "Căn hộ",
  "Biệt thự",
  "Nhà phố",
  "Shophouse",
  "Officetel",
];

export const mockProjectStatuses: Record<MockProject["status"], string> = {
  PLANNING: "Đang quy hoạch",
  OPENING: "Đang mở bán",
  CONSTRUCTION: "Đang xây dựng",
  COMPLETED: "Đã hoàn thành",
};
