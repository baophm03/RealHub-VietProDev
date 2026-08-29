import type { Project } from "@/lib/api/types/projects";
import { formatPrice } from "@/utils";

export function getProjectLocation(project: Project): string {
  const parts: string[] = [];
  if (project.district?.name) parts.push(project.district.name);
  if (project.province?.name) parts.push(project.province.name);
  return parts.length > 0 ? parts.join(", ") : "Đang cập nhật";
}

export function getProjectScale(project: Project): string {
  const count = project._count?.properties;
  if (count && count > 0) return `${count.toLocaleString("vi-VN")} BĐS`;
  return "Đang cập nhật";
}

export function getProjectImage(project: Project): string | null {
  const mediaList = project.media;
  if (!mediaList || mediaList.length === 0) return null;
  const imageItem = mediaList
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
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
