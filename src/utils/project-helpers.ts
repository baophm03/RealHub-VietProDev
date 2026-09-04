import type { Project, ProjectProperty } from "@/lib/api/types/projects";
// Import trực tiếp từ các module con (không qua @/utils index) để tránh circular
// nếu sau này index.ts re-export project-helpers.
import { formatPrice } from "./price";
import { formatLocationShort } from "./location";

export interface ProjectImage {
  url: string;
  caption: string | null;
  id: string;
}

/**
 * Lấy danh sách ảnh dự án (đã sort theo sortOrder, chỉ lấy IMAGE).
 */
export function getProjectImages(project: Project): ProjectImage[] {
  const mediaList = project.media;
  if (!mediaList || mediaList.length === 0) return [];
  return mediaList
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((m) => ({ url: m.file?.url ?? "", caption: m.caption, id: m.id }));
}

/**
 * Lấy URL ảnh đầu tiên (primary) của dự án.
 */
export function getProjectImage(project: Project): string | null {
  return getProjectImages(project)[0]?.url ?? null;
}

/**
 * Lấy URL ảnh đầu tiên của một BĐS thuộc dự án (ProjectProperty).
 */
export function getPropertyImageUrl(property: ProjectProperty): string | null {
  if (!property.media || property.media.length === 0) return null;
  const imageItem = property.media.find((m) => m.file?.url);
  return imageItem?.file?.url ?? null;
}

export function getProjectScale(project: Project): string {
  const count = project._count?.properties;
  if (count && count > 0) return `${count.toLocaleString("vi-VN")} BĐS`;
  return "Đang cập nhật";
}

export function getProjectPriceRange(project: Project): string {
  const from = project.priceFrom;
  const to = project.priceTo;
  if (from == null && to == null) return "Đang cập nhật";
  if (from != null && to != null && from !== to) {
    return `${formatPrice(from)} - ${formatPrice(to)}`;
  }
  const single = from ?? to;
  return single != null ? formatPrice(single) : "Đang cập nhật";
}

