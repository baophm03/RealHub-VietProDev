export interface VisibilityRule {
  id: string;
  entityType: string;
  fieldKey: string;
  roleCode: string;
  visibilityLevel: string;
  maskType?: string | null;
  conditionJson?: unknown;
}

export interface VisibilityPolicy {
  id: string;
  name: string;
  entityType: string;
  status: string;
  priority: number;
  rules: VisibilityRule[];
  createdAt: string;
  updatedAt: string;
}

export const entityTypeLabel: Record<string, string> = {
  PROPERTY: "Bất động sản",
  CUSTOMER: "Khách hàng",
  LEAD: "Lead",
  DEAL: "Giao dịch",
  OWNER_PROFILE: "Hồ sơ chủ nhà",
};

export const visibilityLevelLabel: Record<string, string> = {
  FULL: "Đầy đủ",
  PARTIAL: "Một phần",
  MASKED: "Che giấu",
  HIDDEN: "Ẩn",
};

export const visibilityLevelVariant: Record<string, "green" | "yellow" | "purple" | "red"> = {
  FULL: "green",
  PARTIAL: "yellow",
  MASKED: "purple",
  HIDDEN: "red",
};

export const maskTypeLabel: Record<string, string> = {
  MASK_ALL: "Che tất cả",
  MASK_ALL_EXCEPT_LAST_3: "Giữ 3 số cuối",
  MASK_ALL_EXCEPT_FIRST_2: "Giữ 2 ký tự đầu",
  CUSTOM: "Tùy chỉnh",
};

export const roleOptions = [
  { value: "GUEST", label: "Khách" },
  { value: "CUSTOMER", label: "Khách hàng" },
  { value: "OWNER", label: "Chủ nhà" },
  { value: "SALES", label: "Sales" },
  { value: "COLLABORATOR", label: "CTV" },
  { value: "TEAM_LEADER", label: "Team Leader" },
  { value: "AGENCY_ADMIN", label: "Admin Agency" },
  { value: "OPERATOR", label: "Vận hành" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export interface PolicyFormValues {
  name: string;
  entityType: string;
  priority: number;
}

export interface RuleFormValues {
  fieldKey: string;
  roleCode: string;
  visibilityLevel: string;
  maskType?: string;
}
