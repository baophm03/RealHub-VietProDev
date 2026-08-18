import { setRequestLocale } from "next-intl/server";
import { getApiProjects } from "@/lib/api/endpoints/projects";
import type { GetProjectsResponse, Project } from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import { MapPin, ImageIcon } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-static";
export const revalidate = 3600;

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
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {project.name}
                  </h3>

                  <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{getProjectLocation(project)}</span>
                  </p>

                  <p className="text-sm leading-relaxed text-foreground-muted line-clamp-2">
                    Đang cập nhật thông tin giới thiệu cho dự án {project.name}.
                  </p>

                  <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Giá từ</span>
                      <span className="font-semibold text-primary">Đang cập nhật</span>
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
                      <span className="font-medium text-foreground">Đang cập nhật</span>
                    </div>
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
