export interface SeoTemplate {
  id: string;
  pageType: string;
  name: string;
  titleTemplate: string;
  descriptionTemplate: string;
  ogTitleTemplate: string | null;
  ogDescriptionTemplate: string | null;
  canonicalRuleJson: unknown;
  robotsRule: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const pageTypeLabel: Record<string, string> = {
  HOME: "Trang chủ",
  PROPERTY_LISTING: "Danh sách BĐS",
  PROPERTY_DETAIL: "Chi tiết BĐS",
  BLOG_LIST: "Danh sách tin",
  BLOG_DETAIL: "Chi tiết tin",
  ABOUT: "Giới thiệu",
  CONTACT: "Liên hệ",
};

export interface TemplateFormValues {
  pageType: string;
  name: string;
  titleTemplate: string;
  descriptionTemplate: string;
  ogTitleTemplate: string;
  ogDescriptionTemplate: string;
  robotsRule: string;
}

export const defaultTemplateForm: TemplateFormValues = {
  pageType: "PROPERTY_DETAIL",
  name: "",
  titleTemplate: "",
  descriptionTemplate: "",
  ogTitleTemplate: "",
  ogDescriptionTemplate: "",
  robotsRule: "index,follow",
};
