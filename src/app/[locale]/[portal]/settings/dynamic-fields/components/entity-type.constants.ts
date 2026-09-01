export const entityTypeOptions: { value: string; label: string }[] = [
  { value: "PROPERTY", label: "Bất động sản" },
  { value: "CUSTOMER_NEED", label: "Nhu cầu khách hàng" },
  { value: "LEAD", label: "Nguồn khách hàng" },
  { value: "DEAL", label: "Giao dịch" },
  { value: "OWNER_PROFILE", label: "Hồ sơ chủ nhà" },
];

export const getEntityTypeLabel = (value: string): string =>
  entityTypeOptions.find((o) => o.value === value)?.label || value;
