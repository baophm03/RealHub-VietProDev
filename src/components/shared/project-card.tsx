"use client";

import type { Project } from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import { MapPin } from "lucide-react";
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

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const imageUrl = getProjectImage(project);

  return (
    <Link
      href={`/projects/${project.code}`}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface hover:border-primary transition-colors ${className ?? ""}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={project.name}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.endsWith("/image-fallback.jpg")) return;
              img.src = "/image-fallback.jpg";
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/image-fallback.jpg"
            alt={project.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {project.name}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
          <MapPin size={14} className="shrink-0 mt-0.5" />
          <span className="line-clamp-2">{getProjectLocation(project)}</span>
        </p>

        <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Giá từ</span>
            <span className="font-semibold text-primary">{getProjectPriceRange(project)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Quy mô</span>
            <span className="font-medium text-foreground">{getProjectScale(project)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Chủ đầu tư</span>
            <span className="font-medium text-foreground">{project.developer ?? "Đang cập nhật"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">Bàn giao</span>
            <span className="font-medium text-foreground">{project.handoverDate ?? "Đang cập nhật"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
