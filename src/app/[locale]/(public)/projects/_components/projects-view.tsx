"use client";

import { MapPin, Building, ArrowRight, Spinner } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { useGetApiProjects } from "@/lib/api/endpoints/projects";
import { GetProjectsResponse, Project } from "@/lib/api/types/projects";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80";

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

export function ProjectsView() {
  const { data: projectsData, isLoading } = useGetApiProjects({ limit: "100" });
  const projects = ((projectsData as unknown as GetProjectsResponse)?.data) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} className="animate-spin text-foreground-muted" />
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-foreground-muted">
        Hiển thị <span className="font-medium text-foreground">{projects.length}</span> dự án
      </p>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Chưa có dự án nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                    {projectStatusLabels[project.status] ?? project.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-serif text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {project.name}
                </h3>

                <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <MapPin size={12} weight="fill" />
                  <span className="line-clamp-1">{getProjectLocation(project)}</span>
                </p>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">Giá từ</span>
                    <span className="text-sm font-semibold text-primary">Đang cập nhật</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">Quy mô</span>
                    <span className="text-sm font-medium text-foreground">{getProjectScale(project)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Building size={12} /> {project.developer ?? "Đang cập nhật"}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-foreground-muted">Bàn giao: Đang cập nhật</span>
                  <ArrowRight
                    size={16}
                    className="text-foreground-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
