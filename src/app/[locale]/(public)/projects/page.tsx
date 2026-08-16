import { setRequestLocale } from "next-intl/server";
import { getApiProjects } from "@/lib/api/endpoints/projects";
import type { GetProjectsResponse, Project } from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import { MapPin, Building2, ArrowRight, ImageIcon } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

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

function getProjectImage(project: Project): string | null {
  const mediaList = project.media;
  if (!mediaList || mediaList.length === 0) return null;
  const imageItem = mediaList
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projectsRes = await getApiProjects({ limit: "100" });
  const projects = (projectsRes as unknown as GetProjectsResponse)?.data ?? [];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Dự án
        </span>
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Dự án bất động sản
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
          Khám phá các dự án bất động sản nổi bật từ các chủ đầu tư uy tín trên toàn hệ sinh thái RealHub.
        </p>
      </div>

      <p className="mb-6 text-sm text-foreground-muted">
        Hiển thị <span className="font-medium text-foreground">{projects.length}</span> dự án
      </p>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Chưa có dự án nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const imageUrl = getProjectImage(project);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                      <div className="flex flex-col items-center gap-2 text-foreground-muted">
                        <ImageIcon size={32} />
                        <span className="text-xs">Không có hình ảnh</span>
                      </div>
                    </div>
                  )}
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
                    <MapPin size={12} />
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
                      <Building2 size={12} /> {project.developer ?? "Đang cập nhật"}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
