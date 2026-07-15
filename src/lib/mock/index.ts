export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: "BUYER" | "TENANT" | "INVESTOR" | "OWNER";
  status: string;
  needs: string;
  budget: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
}

export const mockCustomers: MockCustomer[] = [
  { id: "c001", name: "Nguyễn Thị Hồng", phone: "0901***456", email: "hong***@gmail.com", type: "BUYER", status: "ACTIVE", needs: "Căn hộ 2PN Quận 2", budget: "3-5 tỷ", assignedTo: "Nguyễn Văn An", createdAt: "2025-06-20", lastContact: "2025-07-12" },
  { id: "c002", name: "Trần Minh Đức", phone: "0902***789", email: "duc***@gmail.com", type: "INVESTOR", status: "ACTIVE", needs: "Đất nền đầu tư", budget: "2-4 tỷ", assignedTo: "Lê Thị Chi", createdAt: "2025-06-15", lastContact: "2025-07-10" },
  { id: "c003", name: "Lê Thị Mai", phone: "0903***123", email: "mai***@yahoo.com", type: "TENANT", status: "ACTIVE", needs: "Văn phòng Quận 1", budget: "30-40tr/tháng", assignedTo: "Hoàng Văn Em", createdAt: "2025-06-25", lastContact: "2025-07-14" },
  { id: "c004", name: "Phạm Quốc Bảo", phone: "0904***654", email: "bao***@gmail.com", type: "BUYER", status: "INACTIVE", needs: "Biệt thự Thảo Điền", budget: "10-15 tỷ", assignedTo: "Nguyễn Văn An", createdAt: "2025-05-10", lastContact: "2025-06-28" },
  { id: "c005", name: "Vũ Thị Lan", phone: "0905***321", email: "lan***@gmail.com", type: "OWNER", status: "ACTIVE", needs: "Cho thuê căn hộ", budget: "—", assignedTo: "Lê Thị Chi", createdAt: "2025-07-01", lastContact: "2025-07-13" },
  { id: "c006", name: "Đặng Văn Sơn", phone: "0906***987", email: "son***@outlook.com", type: "INVESTOR", status: "ACTIVE", needs: "Mặt bằng kinh doanh", budget: "5-8 tỷ", assignedTo: "Hoàng Văn Em", createdAt: "2025-06-28", lastContact: "2025-07-11" },
  { id: "c007", name: "Bùi Thị Hoa", phone: "0907***258", email: "hoa***@gmail.com", type: "BUYER", status: "ACTIVE", needs: "Nhà phố Phú Nhuận", budget: "5-7 tỷ", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-03", lastContact: "2025-07-14" },
  { id: "c008", name: "Cao Minh Tuấn", phone: "0908***369", email: "tuan***@gmail.com", type: "TENANT", status: "ACTIVE", needs: "Căn hộ dịch vụ Quận 3", budget: "15-20tr/tháng", assignedTo: "Lê Thị Chi", createdAt: "2025-07-08", lastContact: "2025-07-14" },
];

export interface MockLead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: "NEW" | "CONTACTED" | "INTERESTED" | "NEGOTIATING" | "CONVERTED" | "LOST" | "RECYCLED";
  property: string;
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  note: string;
}

export const mockLeads: MockLead[] = [
  { id: "l001", name: "Nguyễn Thị Hồng", phone: "0901***456", source: "WEBSITE", status: "NEW", property: "Vinhomes Central Park", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-14", lastActivity: "2025-07-14", note: "Khách quan tâm căn 2PN view sông" },
  { id: "l002", name: "Trần Minh Đức", phone: "0902***789", source: "SALES_LINK", status: "CONTACTED", property: "Đại Phúc Garden", assignedTo: "Lê Thị Chi", createdAt: "2025-07-10", lastActivity: "2025-07-13", note: "Đã gọi, khách hẹn xem đất tuần sau" },
  { id: "l003", name: "Lê Thị Mai", phone: "0903***123", source: "PROPERTY_DETAIL", status: "INTERESTED", property: "Sunwah Tower", assignedTo: "Hoàng Văn Em", createdAt: "2025-07-08", lastActivity: "2025-07-12", note: "Khách thích văn phòng tầng 15, đang so sánh giá" },
  { id: "l004", name: "Phạm Quốc Bảo", phone: "0904***654", source: "AGENCY_MARKETING", status: "NEGOTIATING", property: "Masteri Thảo Điền", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-05", lastActivity: "2025-07-14", note: "Đàm phán giá, khách đề nghị 11 tỷ" },
  { id: "l005", name: "Vũ Thị Lan", phone: "0905***321", source: "OWNER_PAGE", status: "CONVERTED", property: "Căn hộ dịch vụ Q3", assignedTo: "Lê Thị Chi", createdAt: "2025-07-01", lastActivity: "2025-07-10", note: "Đã ký hợp đồng thuê 6 tháng" },
  { id: "l006", name: "Đặng Văn Sơn", phone: "0906***987", source: "CTV_LINK", status: "NEW", property: "Mặt bằng Nguyễn Trãi", assignedTo: "Hoàng Văn Em", createdAt: "2025-07-13", lastActivity: "2025-07-13", note: "CTV giới thiệu, chưa liên hệ" },
  { id: "l007", name: "Bùi Thị Hoa", phone: "0907***258", source: "WEBSITE", status: "CONTACTED", property: "Nhà phố Phú Nhuận", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-12", lastActivity: "2025-07-14", note: "Khách hẹn xem nhà cuối tuần" },
  { id: "l008", name: "Cao Minh Tuấn", phone: "0908***369", source: "MANUAL_INPUT", status: "LOST", property: "—", assignedTo: "Lê Thị Chi", createdAt: "2025-06-20", lastActivity: "2025-07-01", note: "Khách đã thuê chỗ khác" },
  { id: "l009", name: "Đỗ Thị Nhung", phone: "0909***147", source: "LEAD_POOL", status: "RECYCLED", property: "—", assignedTo: "—", createdAt: "2025-06-15", lastActivity: "2025-06-25", note: "Lead pool, chờ phân bổ lại" },
  { id: "l010", name: "Hồ Văn Khánh", phone: "0910***258", source: "WEBSITE", status: "INTERESTED", property: "Penthouse Metropolitan", assignedTo: "Hoàng Văn Em", createdAt: "2025-07-09", lastActivity: "2025-07-13", note: "Khách quan tâm penthouse, đang chuẩn bị tài chính" },
];

export interface MockDeal {
  id: string;
  title: string;
  customer: string;
  property: string;
  transactionType: "SALE" | "RENT" | "TRANSFER";
  value: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  commission: string;
}

export const mockDeals: MockDeal[] = [
  { id: "d001", title: "Bán căn hộ Vinhomes Central Park", customer: "Nguyễn Thị Hồng", property: "Vinhomes Central Park", transactionType: "SALE", value: "4.5 tỷ", status: "LEAD_QUALIFIED", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-14", updatedAt: "2025-07-14", commission: "Đang tính" },
  { id: "d002", title: "Thuê văn phòng Sunwah Tower", customer: "Lê Thị Mai", property: "Sunwah Tower", transactionType: "RENT", value: "35tr/tháng", status: "NEGOTIATING", assignedTo: "Hoàng Văn Em", createdAt: "2025-07-10", updatedAt: "2025-07-13", commission: "1 tháng thuê" },
  { id: "d003", title: "Bán biệt thự Masteri Thảo Điền", customer: "Phạm Quốc Bảo", property: "Masteri Thảo Điền", transactionType: "SALE", value: "11 tỷ", status: "NEGOTIATING", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-05", updatedAt: "2025-07-14", commission: "2% giá trị GD" },
  { id: "d004", title: "Thuê căn hộ dịch vụ Quận 3", customer: "Cao Minh Tuấn", property: "Căn hộ dịch vụ Q3", transactionType: "RENT", value: "18tr/tháng", status: "RESERVED", assignedTo: "Lê Thị Chi", createdAt: "2025-07-08", updatedAt: "2025-07-12", commission: "0.5 tháng thuê" },
  { id: "d005", title: "Bán nhà phố Phú Nhuận", customer: "Bùi Thị Hoa", property: "Nhà phố Phú Nhuận", transactionType: "SALE", value: "6.8 tỷ", status: "DEPOSIT_PENDING", assignedTo: "Nguyễn Văn An", createdAt: "2025-07-12", updatedAt: "2025-07-14", commission: "1.5% giá trị GD" },
  { id: "d006", title: "Bán đất nền Đại Phúc", customer: "Trần Minh Đức", property: "Đại Phúc Garden", transactionType: "SALE", value: "3.2 tỷ", status: "COMPLETED", assignedTo: "Lê Thị Chi", createdAt: "2025-06-20", updatedAt: "2025-07-10", commission: "Đã xác nhận: 64 triệu" },
  { id: "d007", title: "Thuê mặt bằng Nguyễn Trãi", customer: "Đặng Văn Sơn", property: "Mặt bằng Nguyễn Trãi", transactionType: "RENT", value: "50tr/tháng", status: "LEAD_QUALIFIED", assignedTo: "Hoàng Văn Em", createdAt: "2025-07-13", updatedAt: "2025-07-13", commission: "Đang tính" },
];

export const mockDealStatuses = [
  "LEAD_QUALIFIED",
  "NEGOTIATING",
  "RESERVED",
  "DEPOSIT_PENDING",
  "COMPLETED",
  "CANCELLED",
];

export interface MockAppointment {
  id: string;
  title: string;
  type: "MEETING" | "CALL" | "SITE_VISIT" | "SIGNING";
  customer: string;
  property: string;
  date: string;
  time: string;
  status: string;
  location: string;
  assignedTo: string;
}

export const mockAppointments: MockAppointment[] = [
  { id: "a001", title: "Xem nhà Vinhomes Central Park", type: "SITE_VISIT", customer: "Nguyễn Thị Hồng", property: "Vinhomes Central Park", date: "2025-07-16", time: "09:00", status: "CONFIRMED", location: "Vinhomes Central Park, Bình Thạnh", assignedTo: "Nguyễn Văn An" },
  { id: "a002", title: "Gọi điện tư vấn", type: "CALL", customer: "Trần Minh Đức", property: "Đại Phúc Garden", date: "2025-07-16", time: "14:00", status: "CONFIRMED", location: "Online", assignedTo: "Lê Thị Chi" },
  { id: "a003", title: "Xem văn phòng Sunwah", type: "SITE_VISIT", customer: "Lê Thị Mai", property: "Sunwah Tower", date: "2025-07-17", time: "10:30", status: "PENDING", location: "Sunwah Tower, Quận 1", assignedTo: "Hoàng Văn Em" },
  { id: "a004", title: "Đàm phán giá biệt thự", type: "MEETING", customer: "Phạm Quốc Bảo", property: "Masteri Thảo Điền", date: "2025-07-18", time: "15:00", status: "CONFIRMED", location: "Văn phòng agency", assignedTo: "Nguyễn Văn An" },
  { id: "a005", title: "Ký hợp đồng thuê", type: "SIGNING", customer: "Cao Minh Tuấn", property: "Căn hộ dịch vụ Q3", date: "2025-07-19", time: "11:00", status: "PENDING", location: "Căn hộ, Quận 3", assignedTo: "Lê Thị Chi" },
  { id: "a006", title: "Xem nhà phố Phú Nhuận", type: "SITE_VISIT", customer: "Bùi Thị Hoa", property: "Nhà phố Phú Nhuận", date: "2025-07-20", time: "09:30", status: "CONFIRMED", location: "Phú Nhuận", assignedTo: "Nguyễn Văn An" },
];

export interface MockCommissionPlan {
  id: string;
  name: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "ARCHIVED";
  calcType: "PERCENT" | "FIXED";
  calcBase: "EXPECTED_VALUE" | "ACTUAL_VALUE" | "NET_VALUE";
  rate: string;
  effectiveFrom: string;
  effectiveTo: string;
  splits: { role: string; type: "PERCENT" | "FIXED"; value: string }[];
}

export const mockCommissionPlans: MockCommissionPlan[] = [
  {
    id: "cp001",
    name: "Hoa hồng bán căn hộ — Standard",
    status: "ACTIVE",
    calcType: "PERCENT",
    calcBase: "ACTUAL_VALUE",
    rate: "2%",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    splits: [
      { role: "Sales", type: "PERCENT", value: "60%" },
      { role: "Team Leader", type: "PERCENT", value: "15%" },
      { role: "Agency", type: "PERCENT", value: "20%" },
      { role: "CTV", type: "PERCENT", value: "5%" },
    ],
  },
  {
    id: "cp002",
    name: "Hoa hồng thuê — Monthly",
    status: "ACTIVE",
    calcType: "FIXED",
    calcBase: "ACTUAL_VALUE",
    rate: "1 tháng thuê",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    splits: [
      { role: "Sales", type: "PERCENT", value: "70%" },
      { role: "Team Leader", type: "PERCENT", value: "10%" },
      { role: "Agency", type: "PERCENT", value: "20%" },
    ],
  },
  {
    id: "cp003",
    name: "Hoa hồng biệt thự — Premium",
    status: "PENDING_APPROVAL",
    calcType: "PERCENT",
    calcBase: "ACTUAL_VALUE",
    rate: "3%",
    effectiveFrom: "2025-08-01",
    effectiveTo: "2026-07-31",
    splits: [
      { role: "Sales", type: "PERCENT", value: "65%" },
      { role: "Team Leader", type: "PERCENT", value: "15%" },
      { role: "Agency", type: "PERCENT", value: "20%" },
    ],
  },
  {
    id: "cp004",
    name: "Hoa hồng đất nền — Developer",
    status: "DRAFT",
    calcType: "PERCENT",
    calcBase: "EXPECTED_VALUE",
    rate: "1.5%",
    effectiveFrom: "2025-09-01",
    effectiveTo: "2026-06-30",
    splits: [
      { role: "Sales", type: "PERCENT", value: "50%" },
      { role: "Team Leader", type: "PERCENT", value: "20%" },
      { role: "Agency", type: "PERCENT", value: "25%" },
      { role: "CTV", type: "PERCENT", value: "5%" },
    ],
  },
];

export interface MockCommissionDeal {
  id: string;
  deal: string;
  sales: string;
  amount: string;
  status: "ESTIMATED" | "PENDING_CONFIRMATION" | "CONFIRMED" | "ADJUSTED" | "CANCELLED";
  date: string;
}

export const mockCommissionDeals: MockCommissionDeal[] = [
  { id: "cd001", deal: "Bán đất nền Đại Phúc", sales: "Lê Thị Chi", amount: "64,000,000đ", status: "CONFIRMED", date: "2025-07-10" },
  { id: "cd002", deal: "Bán biệt thự Masteri", sales: "Nguyễn Văn An", amount: "220,000,000đ", status: "ESTIMATED", date: "2025-07-14" },
  { id: "cd003", deal: "Thuê căn hộ Q3", sales: "Lê Thị Chi", amount: "9,000,000đ", status: "CONFIRMED", date: "2025-07-10" },
  { id: "cd004", deal: "Bán nhà phố Phú Nhuận", sales: "Nguyễn Văn An", amount: "102,000,000đ", status: "PENDING_CONFIRMATION", date: "2025-07-14" },
  { id: "cd005", deal: "Thuê mặt bằng Nguyễn Trãi", sales: "Hoàng Văn Em", amount: "25,000,000đ", status: "ESTIMATED", date: "2025-07-13" },
];

export interface MockFile {
  id: string;
  name: string;
  type: "image" | "document" | "video";
  size: string;
  uploadedAt: string;
  visibility: string;
  url: string;
}

export const mockFiles: MockFile[] = [
  { id: "f001", name: "vinhomes-living-room.jpg", type: "image", size: "2.4 MB", uploadedAt: "2025-07-10", visibility: "PUBLIC", url: "https://images.unsplash.com/photo-1600596542847-89b2c6a0d6ab?w=400&q=80" },
  { id: "f002", name: "masteri-exterior.jpg", type: "image", size: "3.1 MB", uploadedAt: "2025-07-12", visibility: "PUBLIC", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd8ae?w=400&q=80" },
  { id: "f003", name: "so-hong-vinhomes.pdf", type: "document", size: "1.2 MB", uploadedAt: "2025-07-08", visibility: "SENSITIVE", url: "" },
  { id: "f004", name: "hop-dong-thue-sunwah.pdf", type: "document", size: "890 KB", uploadedAt: "2025-07-05", visibility: "TENANT", url: "" },
  { id: "f005", name: "sunwah-office-tour.mp4", type: "video", size: "45 MB", uploadedAt: "2025-07-06", visibility: "PUBLIC", url: "" },
  { id: "f006", name: "phu-nhuan-house.jpg", type: "image", size: "2.8 MB", uploadedAt: "2025-07-14", visibility: "PUBLIC", url: "https://images.unsplash.com/photo-1568605114967-8130fc81cb94?w=400&q=80" },
  { id: "f007", name: "daiphuc-land.jpg", type: "image", size: "1.9 MB", uploadedAt: "2025-07-13", visibility: "PUBLIC", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" },
  { id: "f008", name: "metropolitan-penthouse.jpg", type: "image", size: "3.5 MB", uploadedAt: "2025-07-11", visibility: "PUBLIC", url: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=400&q=80" },
];

export const mockDashboardStats = {
  totalProperties: 1247,
  activeLeads: 86,
  monthlyDeals: 24,
  monthlyRevenue: "2.4 tỷ",
  propertiesChange: 12,
  leadsChange: 8,
  dealsChange: -3,
  revenueChange: 15,
};

export const mockDashboardCharts = {
  dealsByMonth: [
    { month: "T1", value: 12 },
    { month: "T2", value: 15 },
    { month: "T3", value: 18 },
    { month: "T4", value: 14 },
    { month: "T5", value: 20 },
    { month: "T6", value: 22 },
    { month: "T7", value: 24 },
  ],
  leadsBySource: [
    { source: "Website", value: 32 },
    { source: "Sales Link", value: 24 },
    { source: "Property Detail", value: 18 },
    { source: "CTV", value: 8 },
    { source: "Khác", value: 4 },
  ],
  propertiesByType: [
    { type: "Căn hộ", value: 580 },
    { type: "Nhà phố", value: 280 },
    { type: "Biệt thự", value: 120 },
    { type: "Đất nền", value: 167 },
    { type: "Khác", value: 100 },
  ],
};
