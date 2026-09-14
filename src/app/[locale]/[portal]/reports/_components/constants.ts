export const dealStatusLabels: Record<string, string> = {
  SOFT_RESERVED: "Đặt cọc mềm",
  NEGOTIATING: "Đàm phán",
  CONTRACT_PENDING: "Chờ HĐ",
  SIGNED: "Đã ký",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Hủy",
};

export const leadStatusLabels: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã LH",
  INTERESTED: "Quan tâm",
  NEGOTIATING: "Đàm phán",
  CONVERTED: "Chuyển đổi",
  LOST: "Mất",
};

export const apptStatusLabels: Record<string, string> = {
  SCHEDULED: "Đã lên lịch",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
};

export const reservationStatusLabels: Record<string, string> = {
  ACTIVE: "Hiệu lực",
  EXPIRED: "Hết hạn",
  CONVERTED: "Đã chuyển",
  CANCELLED: "Đã hủy",
};

export const sellingModeLabels: Record<string, string> = {
  SELF_SELL: "Tự bán",
  SALES_DISTRIBUTION: "Phân phối sales",
  HYBRID: "Kết hợp",
  INTERNAL_ONLY: "Nội bộ",
  AGENCY_DISTRIBUTION: "Phân phối đại lý",
};

export const verificationLabels: Record<string, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  VERIFIED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const publicationLabels: Record<string, string> = {
  PRIVATE: "Riêng tư",
  PUBLIC: "Công khai",
  ARCHIVED: "Lưu trữ",
};

export const businessLabels: Record<string, string> = {
  AVAILABLE: "Sẵn bán",
  RESERVED: "Đã đặt cọc",
  SOLD: "Đã bán",
  RENTED: "Đã cho thuê",
  OFF_MARKET: "Off market",
};

export const commissionStatusLabels: Record<string, string> = {
  DRAFT: "Nháp",
  ESTIMATED: "Đã ước tính",
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  ADJUSTED: "Đã điều chỉnh",
  CANCELLED: "Đã hủy",
};

export const roleLabels: Record<string, string> = {
  SALES: "Sales",
  COLLABORATOR: "CTV",
  TEAM_LEADER: "Team Leader",
  AGENCY: "Agency",
  OWNER: "Owner",
  UNKNOWN: "Khác",
};

export const CHART_COLORS = [
  "#2a5f3f",
  "#5b8c6e",
  "#8fb5a0",
  "#c4d9cc",
  "#d4a373",
  "#a07c5c",
  "#787774",
  "#b8a99a",
];

export const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};
