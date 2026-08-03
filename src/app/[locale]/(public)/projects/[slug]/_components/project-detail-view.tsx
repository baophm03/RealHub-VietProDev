"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { MapPin, ArrowLeft, Phone, Calendar, ArrowRight, Spinner, Camera } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useGetApiProjectId, useGetApiProjects } from "@/lib/api/endpoints/projects";
import type { Project } from "@/lib/api/types/projects";
import { ProjectCardImage } from "@/components/shared/project-card-image";
import { PropertyCardImage } from "@/components/shared/property-card-image";

const projectStatusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

function getProjectLocation(project: Project): string {
  const parts: string[] = [];
  if (project.district?.name) parts.push(project.district.name);
  if (project.province?.name) parts.push(project.province.name);
  return parts.length > 0 ? parts.join(", ") : "Đang cập nhật";
}

function getProjectScale(project: Project): string {
  const count = project._count?.properties;
  if (count && count > 0) return `${count.toLocaleString("vi-VN")} BĐS`;
  return "Đang cập nhật";
}

export function ProjectDetailView() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: projectData, isLoading } = useGetApiProjectId(slug);
  const { data: projectsData } = useGetApiProjects({ limit: "10" });

  const project = useMemo(() => {
    const raw = projectData as any;
    return raw?.data ?? raw ?? null;
  }, [projectData]);

  const projectMedia = useMemo(() => {
    const mediaList = project?.media as any[] | undefined;
    if (!mediaList || mediaList.length === 0) return [];
    return mediaList
      .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [project]);

  const relatedProjects = useMemo(() => {
    const raw = projectsData as any;
    const list: Project[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
    return list.filter((p) => p.id !== slug).slice(0, 3);
  }, [projectsData, slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} className="animate-spin text-foreground-muted" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-8 md:py-12 lg:px-12">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Quay lại danh sách dự án
        </Link>
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="mb-2 font-serif text-2xl font-semibold">Không tìm thấy dự án</h1>
          <p className="text-sm text-foreground-muted">Dự án bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
        </div>
      </div>
    );
  }

  const location = getProjectLocation(project);
  const scale = getProjectScale(project);
  const heroImage = projectMedia[0]?.file?.url;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-8 md:py-12 lg:px-12">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Quay lại danh sách dự án
      </Link>

      {/* Hero */}
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
        {heroImage ? (
          <img
            src={heroImage}
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-muted">
            <div className="flex flex-col items-center gap-2 text-foreground-muted">
              <Camera size={32} weight="duotone" />
              <span className="text-sm">Chưa có hình ảnh cho dự án này</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
            {projectStatusLabels[project.status] ?? project.status}
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
            <MapPin size={14} weight="fill" />
            <span>{location}</span>
          </p>
        </div>
      </div>

      {/* Gallery */}
      {projectMedia.length > 1 && (
        <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          {projectMedia.slice(1, 5).map((img, i) => (
            <div key={img.id || i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={img.file?.url}
                alt={img.caption || project.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick Info */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Giá từ", value: "Đang cập nhật" },
          { label: "Quy mô", value: scale },
          { label: "Loại hình", value: "Đang cập nhật" },
          { label: "Bàn giao", value: "Đang cập nhật" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4">
            <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          {/* Description */}
          <div>
            <h2 className="mb-3 font-serif text-xl font-semibold">Giới thiệu dự án</h2>
            <p className="text-base leading-relaxed text-foreground-muted">Đang cập nhật thông tin giới thiệu cho dự án {project.name}.</p>
          </div>

          {/* Details */}
          <div>
            <h2 className="mb-4 font-serif text-xl font-semibold">Thông tin chi tiết</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: "Tên dự án", value: project.name },
                { label: "Mã dự án", value: project.code },
                { label: "Vị trí", value: location },
                { label: "Chủ đầu tư", value: project.developer ?? "Đang cập nhật" },
                { label: "Quy mô", value: scale },
                { label: "Trạng thái", value: projectStatusLabels[project.status] ?? project.status },
              ].map((row) => (
                <div key={row.label} className="flex justify-between border-b border-border pt-1 pb-2">
                  <span className="text-sm text-foreground-muted">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Properties in project */}
          {project.properties && project.properties.length > 0 && (
            <div>
              <h2 className="mb-4 font-serif text-xl font-semibold">Bất động sản thuộc dự án</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {project.properties.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/listings/${item.id}`}
                    className="group flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_8px_24px_-12px_rgba(45,95,63,0.12)]"
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
                      <h3 className="text-sm font-semibold tracking-tight text-foreground line-clamp-1">{item.title}</h3>
                      <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                        <MapPin size={12} className="text-primary" />
                        {item.propertyCode}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Khoảng giá</span>
              <p className="text-2xl font-semibold text-primary">Đang cập nhật</p>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Đăng ký tư vấn</h3>
              <p className="text-xs text-foreground-muted">
                Đội ngũ RealHub sẵn sàng tư vấn chi tiết về dự án {project.name}.
              </p>
              <Button size="lg" className="w-full" leftIcon={<Phone size={16} />}>
                Liên hệ ngay
              </Button>
              <Button variant="outline" size="lg" className="w-full" leftIcon={<Calendar size={16} />}>
                Đặt lịch xem dự án
              </Button>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-2 text-xs text-foreground-muted">
              <div className="flex justify-between">
                <span>Chủ đầu tư</span>
                <span className="font-medium text-foreground">{project.developer ?? "Đang cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span>Vị trí</span>
                <span className="font-medium text-foreground">{location}</span>
              </div>
              <div className="flex justify-between">
                <span>Quy mô</span>
                <span className="font-medium text-foreground">{scale}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">Dự án liên quan</h2>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              Xem tất cả
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ProjectCardImage
                    projectId={p.id}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    iconSize={24}
                  />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <h3 className="font-serif text-base font-medium transition-colors group-hover:text-primary">{p.name}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin size={12} weight="fill" /> {getProjectLocation(p)}
                  </p>
                  <span className="text-sm font-semibold text-primary">{getProjectScale(p)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
