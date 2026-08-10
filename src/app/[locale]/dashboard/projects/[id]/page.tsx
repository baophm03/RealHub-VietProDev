"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building,
  PencilSimple,
  CaretRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiProjectId } from "@/lib/api/endpoints/projects";
import { Project } from "@/lib/api/types/projects";
import { PropertyCardImage } from "@/components/shared/property-card-image";
import { useMemo } from "react";
import { Camera } from "@phosphor-icons/react";

const statusVariant: Record<string, "green" | "default"> = {
  ACTIVE: "green",
  INACTIVE: "default",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const businessStatusLabel: Record<string, string> = {
  AVAILABLE: "Sẵn có",
  RESERVED: "Đặt cọc",
  SOLD: "Đã bán",
  RENTED: "Đã thuê",
  OFF_MARKET: "Ngừng bán",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: projectData, isLoading } = useGetApiProjectId(id);
  const project = (projectData as unknown as { data: Project })?.data;
  const properties = project?.properties ?? [];

  const projectMedia = useMemo(() => {
    const mediaList = (project as any)?.media as any[] | undefined;
    if (!mediaList || mediaList.length === 0) return [];
    return mediaList
      .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-muted" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="h-10 w-3/4 animate-pulse rounded-lg bg-surface-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-base text-foreground-muted">Không tìm thấy dự án.</p>
        <Button onClick={() => router.push("/dashboard/properties")}>Quay lại danh sách</Button>
      </div>
    );
  }

  const location = [project.district?.name, project.province?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/properties")}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          Quay lại danh sách
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/projects/${id}/edit`)}
        >
          <PencilSimple size={14} />
          Chỉnh sửa
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <Link href="/dashboard/properties" className="transition-colors hover:text-foreground">
            Bất động sản
          </Link>
          <CaretRight size={12} />
          <Link href="/dashboard/properties?tab=projects" className="transition-colors hover:text-foreground">
            Dự án
          </Link>
          <CaretRight size={12} />
          <span>{project.name}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-4xl">
              {project.name}
            </h1>
            <Badge variant={statusVariant[project.status] ?? "default"}>
              {statusLabel[project.status] ?? project.status}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 text-sm text-foreground-muted md:flex-row md:items-center md:gap-4">
            <span className="flex items-center gap-1.5">
              <Building size={14} className="text-primary" />
              Mã: <span className="font-mono font-medium text-foreground">{project.code}</span>
            </span>
            {project.developer && (
              <span className="flex items-center gap-1.5">
                <Building size={14} className="text-primary" />
                {project.developer}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Project Media Gallery */}
      {projectMedia.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
          {projectMedia.slice(0, 5).map((img, i) => (
            <div
              key={img.id || i}
              className={`relative group overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2" : ""} ${i >= 1 ? "hidden md:block" : ""}`}
            >
              <img
                src={img.file?.url}
                alt={img.caption || project.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.isPrimary && i === 0 && (
                <div className="absolute top-4 right-4 rounded-lg bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  Ảnh chính
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <Camera size={32} weight="duotone" />
            <p className="text-sm">Chưa có hình ảnh cho dự án này</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-6 md:grid-cols-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
            Mã dự án
          </span>
          <span className="font-mono text-lg font-medium text-foreground">{project.code}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
            Chủ đầu tư
          </span>
          <span className="text-lg font-medium text-foreground">{project.developer ?? "-"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
            Vị trí
          </span>
          <span className="text-lg font-medium text-foreground">{location || "-"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
            Số bất động sản
          </span>
          <span className="text-lg font-medium text-foreground">
            {properties.length}
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Bất động sản thuộc dự án
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/properties/new?projectId=${id}`)}
          >
            Thêm BĐS vào dự án
          </Button>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-12 text-center">
            <p className="text-sm text-foreground-muted">
              Chưa có bất động sản nào trong dự án này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={`/dashboard/properties/${item.id}`}
                  className="group flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-12px_rgba(45,95,63,0.12)]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <PropertyCardImage
                      propertyId={item.id}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      iconSize={24}
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <MapPin size={12} className="text-primary" />
                      {item.propertyCode}
                    </p>
                    <div className="flex items-center justify-between border-t border-border pt-2">
                      <span className="font-mono text-xs text-foreground-muted">
                        {item.publicationStatus === "PRIVATE" ? "Riêng tư" : "Công khai"}
                      </span>
                      <Badge variant="default">
                        {businessStatusLabel[item.businessStatus ?? ""] ?? item.businessStatus}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
