export const leadStatusConfig: Record<string, { label: string; variant: "blue" | "yellow" | "purple" | "green" | "red" | "default" }> = {
  NEW: { label: "Mới", variant: "blue" },
  CONTACTED: { label: "Đã liên hệ", variant: "yellow" },
  INTERESTED: { label: "Quan tâm", variant: "purple" },
  NEGOTIATING: { label: "Đàm phán", variant: "default" },
  CONVERTED: { label: "Chuyển đổi", variant: "green" },
  LOST: { label: "Mất", variant: "red" },
};

export const leadStatusConfigLabels: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  INTERESTED: "Quan tâm",
  NEGOTIATING: "Đàm phán",
  CONVERTED: "Chuyển đổi",
  LOST: "Mất",
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

export const dealStatusLabels: Record<string, string> = {
  SOFT_RESERVED: "Đặt cọc mềm",
  NEGOTIATING: "Đàm phán",
  CONTRACT_PENDING: "Chờ hợp đồng",
  SIGNED: "Đã ký",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Hủy",
};

export const CHART_COLORS = [
  "#2a5f3f",
  "#5b8c6e",
  "#8fb5a0",
  "#c4d9cc",
  "#d4a373",
  "#a07c5c",
];

export const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n);
}
