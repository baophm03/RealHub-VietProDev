export interface MockProperty {
  id: string;
  title: string;
  type: string;
  transactionType: "SALE" | "RENT";
  price: number;
  priceText: string;
  pricePerSqm?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  district: string;
  province: string;
  status: string;
  publicationStatus: string;
  sellingMode: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  direction: string;
  legalStatus: string;
  badge?: "Premium" | "Hot Deal" | null;
  photoCount: number;
  verified: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  owner: string;
}

export const mockProperties: MockProperty[] = [
  {
    id: "p001",
    title: "Căn hộ cao cấp Vinhomes Central Park",
    type: "Căn hộ",
    transactionType: "SALE",
    price: 4500000000,
    priceText: "4.5 tỷ",
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    address: "208 Nguyễn Hữu Cảnh, Bình Thạnh",
    district: "Bình Thạnh",
    province: "TP. Hồ Chí Minh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "SALES_DISTRIBUTION",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    description: "Căn hộ 2PN view sông tuyệt đẹp, nội thất đầy đủ, ban công rộng. Tầng trung, thoáng mát.",
    features: ["Hồ bơi", "Gym", "An ninh 24/7", "Siêu thị", "Trường học"],
    direction: "Đông",
    legalStatus: "Sổ hồng riêng",
    badge: "Premium",
    photoCount: 12,
    verified: true,
    tags: ["Sổ hồng riêng", "Gần Metro"],
    createdAt: "2025-06-15T08:00:00Z",
    updatedAt: "2025-07-10T10:30:00Z",
    assignedTo: "Nguyễn Văn An",
    owner: "Trần Văn Bình",
  },
  {
    id: "p002",
    title: "Biệt thự liền kề Masteri Thảo Điền",
    type: "Biệt thự",
    transactionType: "SALE",
    price: 12000000000,
    priceText: "12 tỷ",
    area: 220,
    bedrooms: 4,
    bathrooms: 5,
    address: "159 Xa Lộ Hà Nội, Thảo Điền",
    district: "Quận 2",
    province: "TP. Hồ Chí Minh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "HYBRID",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    ],
    description: "Biệt thự sân vườn, hồ bơi riêng, thiết kế hiện đại. Khu an ninh, tiện ích đầy đủ.",
    features: ["Hồ bơi riêng", "Sân vườn", "Garage 2 xe", "Nội thất cao cấp"],
    direction: "Nam",
    legalStatus: "Sổ hồng riêng",
    badge: null,
    photoCount: 24,
    verified: true,
    tags: ["View Sông", "Full Nội Thất"],
    createdAt: "2025-05-20T08:00:00Z",
    updatedAt: "2025-07-12T14:00:00Z",
    assignedTo: "Lê Thị Chi",
    owner: "Phạm Văn Dũng",
  },
  {
    id: "p003",
    title: "Văn phòng cho thuê Quận 1 — Sunwah Tower",
    type: "Văn phòng",
    transactionType: "RENT",
    price: 35000000,
    priceText: "35 triệu/tháng",
    area: 120,
    bedrooms: 0,
    bathrooms: 2,
    address: "115 Nguyễn Huệ, Quận 1",
    district: "Quận 1",
    province: "TP. Hồ Chí Minh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "SALES_DISTRIBUTION",
    image: "https://images.unsplash.com/photo-1497366811353-677bb852583a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-677bb852583a?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=1200&q=80",
    ],
    description: "Văn phòng hạng A, view thành phố, nội thất cao cấp. Phù hợp công ty nước ngoài.",
    features: ["Lễ tân 24/7", "Thang máy tốc độ cao", "Bãi đỗ xe", "Phòng họp"],
    direction: "Đông",
    legalStatus: "Hợp đồng mua bán",
    badge: null,
    photoCount: 8,
    verified: true,
    tags: ["Lễ tân 24/7", "Nội thất cao cấp"],
    createdAt: "2025-06-01T08:00:00Z",
    updatedAt: "2025-07-08T09:15:00Z",
    assignedTo: "Hoàng Văn Em",
    owner: "Vũ Thị Phương",
  },
  {
    id: "p004",
    title: "Nhà phố hẻm xe hơi Phú Nhuận",
    type: "Nhà phố",
    transactionType: "SALE",
    price: 6800000000,
    priceText: "6.8 tỷ",
    area: 60,
    bedrooms: 3,
    bathrooms: 3,
    address: "Hẻm 42 Phan Xích Long, Phú Nhuận",
    district: "Phú Nhuận",
    province: "TP. Hồ Chí Minh",
    status: "RESERVED",
    publicationStatus: "PUBLISHED",
    sellingMode: "SELF_SELL",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    ],
    description: "Nhà phố 4 tầng, hẻm xe hơi thông, sổ hồng chính chủ. Gần chợ, trường học.",
    features: ["Hẻm xe hơi", "Sổ hồng", "4 tầng", "Có sân thượng"],
    direction: "Tây",
    legalStatus: "Sổ hồng riêng",
    badge: "Hot Deal",
    photoCount: 8,
    verified: false,
    tags: ["Hẻm xe hơi", "Sổ hồng"],
    createdAt: "2025-06-25T08:00:00Z",
    updatedAt: "2025-07-14T16:45:00Z",
    owner: "Đặng Văn Giang",
  },
  {
    id: "p005",
    title: "Đất nền dự án Đại Phúc Garden",
    type: "Đất nền",
    transactionType: "SALE",
    price: 3200000000,
    priceText: "3.2 tỷ",
    area: 100,
    bedrooms: 0,
    bathrooms: 0,
    address: "Đại Phúc, Bắc Ninh",
    district: "Bắc Ninh",
    province: "Bắc Ninh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "MARKETPLACE_PUBLIC",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=1200&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
    ],
    description: "Đất nền 100m2, mặt tiền 6m, đường 12m. Sổ đỏ sẵn sàng, pháp lý chuẩn.",
    features: ["Sổ đỏ", "Mặt tiền 6m", "Đường 12m", "Tiện ích dự án"],
    direction: "Nam",
    legalStatus: "Sổ đỏ",
    badge: null,
    photoCount: 5,
    verified: true,
    tags: ["Sổ đỏ", "Mặt tiền 6m"],
    createdAt: "2025-07-01T08:00:00Z",
    updatedAt: "2025-07-13T11:20:00Z",
    assignedTo: "Nguyễn Văn An",
    owner: "Tập đoàn Đại Phúc",
  },
  {
    id: "p006",
    title: "Căn hộ dịch vụ cho thuê Quận 3",
    type: "Căn hộ dịch vụ",
    transactionType: "RENT",
    price: 18000000,
    priceText: "18 triệu/tháng",
    area: 45,
    bedrooms: 1,
    bathrooms: 1,
    address: "123 Võ Văn Tần, Quận 3",
    district: "Quận 3",
    province: "TP. Hồ Chí Minh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "INTERNAL_ONLY",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    ],
    description: "Căn hộ dịch vụ 1PN full nội thất, phù hợp người nước ngoài. Dịch vụ vệ sinh hàng tuần.",
    features: ["Full nội thất", "Dịch vụ vệ sinh", "Wifi", "Điều hòa"],
    direction: "Đông Nam",
    legalStatus: "Hợp đồng mua bán",
    badge: null,
    photoCount: 10,
    verified: false,
    tags: ["Full nội thất", "Dịch vụ vệ sinh"],
    createdAt: "2025-06-10T08:00:00Z",
    updatedAt: "2025-07-05T08:00:00Z",
    assignedTo: "Lê Thị Chi",
    owner: "Công ty BĐS Sài Gòn",
  },
  {
    id: "p007",
    title: "Mặt bằng kinh doanh Nguyễn Trãi",
    type: "Mặt bằng",
    transactionType: "RENT",
    price: 50000000,
    priceText: "50 triệu/tháng",
    area: 80,
    bedrooms: 0,
    bathrooms: 1,
    address: "456 Nguyễn Trãi, Quận 5",
    district: "Quận 5",
    province: "TP. Hồ Chí Minh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "SALES_DISTRIBUTION",
    image: "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1448630360428-01ff6bd97ffd?w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-677bb852583a?w=1200&q=80",
    ],
    description: "Mặt bằng kinh doanh mặt tiền Nguyễn Trãi, vị trí đắc địa, phù hợp F&B, thời trang.",
    features: ["Mặt tiền", "Đường lớn", "Chỗ để xe", "Phù hợp kinh doanh"],
    direction: "Nam",
    legalStatus: "Hợp đồng mua bán",
    badge: null,
    photoCount: 6,
    verified: false,
    tags: ["Mặt tiền", "Phù hợp kinh doanh"],
    createdAt: "2025-07-05T08:00:00Z",
    updatedAt: "2025-07-14T10:00:00Z",
    assignedTo: "Hoàng Văn Em",
    owner: "Gia đình Trần",
  },
  {
    id: "p008",
    title: "Penthouse The Metropolitan",
    type: "Căn hộ",
    transactionType: "SALE",
    price: 8500000000,
    priceText: "8.5 tỷ",
    area: 160,
    bedrooms: 3,
    bathrooms: 4,
    address: "Tôn Đức Thắng, Quận 1",
    district: "Quận 1",
    province: "TP. Hồ Chí Minh",
    status: "AVAILABLE",
    publicationStatus: "PUBLISHED",
    sellingMode: "SALES_DISTRIBUTION",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
    ],
    description: "Penthouse tầng cao nhất, view 360 độ, terrace riêng. Nội thất nhập khẩu Ý.",
    features: ["Terrace riêng", "View 360", "Nội thất Ý", "Thang máy riêng"],
    direction: "Đông Bắc",
    legalStatus: "Sổ hồng riêng",
    badge: "Premium",
    photoCount: 18,
    verified: true,
    tags: ["Terrace riêng", "View 360"],
    createdAt: "2025-06-18T08:00:00Z",
    updatedAt: "2025-07-11T15:30:00Z",
    assignedTo: "Nguyễn Văn An",
    owner: "Tập đoàn Metropolitan",
  },
];

export const mockPropertyTypes = [
  "Tất cả",
  "Căn hộ",
  "Biệt thự",
  "Nhà phố",
  "Đất nền",
  "Văn phòng",
  "Mặt bằng",
  "Căn hộ dịch vụ",
];

export const mockDistricts = [
  "Tất cả",
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 5",
  "Bình Thạnh",
  "Phú Nhuận",
  "Bắc Ninh",
];

export const mockZones = [
  "Tất cả khu vực",
  "Khu Đông (Q2, Q9, Thủ Đức)",
  "Khu Nam (Q7, Nhà Bè)",
  "Trung tâm (Q1, Q3)",
  "Khu Bắc (Bình Thạnh, Phú Nhuận)",
];

export const mockLegalStatuses = [
  "Tất cả",
  "Sổ hồng riêng",
  "Hợp đồng mua bán",
  "Đang chờ sổ",
  "Sổ đỏ",
];

export const mockDirections = [
  "Tất cả",
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Nam",
  "Đông Bắc",
  "Tây Nam",
  "Tây Bắc",
];

export const mockHotAreas = [
  { label: "Khu Đông (Thủ Đức)", active: true },
  { label: "Khu Nam (Quận 7)", active: false },
  { label: "Trung tâm Quận 1", active: false },
  { label: "Bán đảo Thủ Thiêm", active: false },
  { label: "Bình Thạnh", active: false },
  { label: "Phú Nhuận", active: false },
];

export function formatPricePerSqm(price: number, area: number): string {
  const perSqm = Math.round(price / area);
  if (perSqm >= 1000000) {
    return `~${(perSqm / 1000000).toFixed(1)} tr/m²`;
  }
  return `~${perSqm.toLocaleString("vi-VN")} đ/m²`;
}
