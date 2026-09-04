import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
  CheckCircle2,
  Circle,
} from "lucide-react";

export interface NotificationRule {
  id: string;
  tenantId: string;
  eventCode: string;
  receiverType: string;
  channel: string;
  templateId?: string | null;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  tenantId: string;
  code: string;
  titleTemplate: string;
  bodyTemplate: string;
  channel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const receiverTypeLabel: Record<string, string> = {
  SALES_AGENT: "Sales agent",
  SALES_MANAGER: "Sales manager",
  TEAM_LEAD: "Team leader",
  ALL_USERS: "Tất cả user",
};

export const receiverTypeOptions = Object.keys(receiverTypeLabel).map((k) => ({
  value: k,
  label: receiverTypeLabel[k] ?? k,
}));

export const channelLabel: Record<string, string> = {
  EMAIL: "Email",
  SMS: "SMS",
  PUSH: "Push",
  IN_APP: "In-app",
};

export const channelOptions = Object.keys(channelLabel).map((k) => ({
  value: k,
  label: channelLabel[k] ?? k,
}));

export const channelIcon: Record<string, typeof Mail> = {
  EMAIL: Mail,
  SMS: MessageSquare,
  PUSH: Smartphone,
  IN_APP: Bell,
};

export const eventCodeOptions: { value: string; label: string }[] = [
  { value: "LEAD_ASSIGNED", label: "Lead được gán" },
  { value: "LEAD_CREATED", label: "Lead mới tạo" },
  { value: "LEAD_STATUS_CHANGED", label: "Lead đổi trạng thái" },
  { value: "APPOINTMENT_REMINDER", label: "Nhắc lịch hẹn" },
  { value: "APPOINTMENT_CREATED", label: "Lịch hẹn mới" },
  { value: "APPOINTMENT_CANCELLED", label: "Lịch hẹn bị hủy" },
  { value: "DEAL_CREATED", label: "Giao dịch mới" },
  { value: "DEAL_STATUS_CHANGED", label: "Giao dịch đổi trạng thái" },
  { value: "DEAL_WON", label: "Giao dịch thắng" },
  { value: "DEAL_LOST", label: "Giao dịch thua" },
  { value: "PROPERTY_SUBMITTED", label: "BĐS gửi duyệt" },
  { value: "PROPERTY_APPROVED", label: "BĐS được duyệt" },
  { value: "PROPERTY_REJECTED", label: "BĐS bị từ chối" },
  { value: "COMMISSION_CONFIRMED", label: "Hoa hồng xác nhận" },
  { value: "COMMISSION_APPROVED", label: "Hoa hồng duyệt" },
  { value: "ASSIGNMENT_EXPIRED", label: "Phân công hết hạn" },
];

export function eventCodeLabel(code: string): string {
  return eventCodeOptions.find((o) => o.value === code)?.label ?? code;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export { Bell, CheckCircle2, Circle, Monitor };
