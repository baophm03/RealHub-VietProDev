import { getApiProjects } from "@/lib/api/endpoints/projects";
import type { GetProjectsResponse, Project } from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin, Building2 } from "lucide-react";

const statusLabel: Record<string, string> = {
  PLANNING: "Đang quy hoạch",
  UNDER_CONSTRUCTION: "Đang thi công",
  COMPLETED: "Đã hoàn thành",
  HANDED_OVER: "Đã bàn giao",
};

export async function FeaturedProjects() {
  let projects: Project[] = [];

  try {
    const res = await getApiProjects({ limit: "4" } as any);
    projects = ((res as unknown as GetProjectsResponse)?.data) || [];
  } catch {
    // Keep empty
  }

  return (
    <section className="py-16 md:py-24 bg-surface-muted/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Dự án
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
              Dự án nổi bật
            </h2>
            <p className="max-w-[48ch] text-sm leading-relaxed text-foreground-muted">
              Các dự án bất động sản đáng chú ý từ chủ đầu tư uy tín trên toàn quốc.
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium shadow-xs transition-all hover:bg-muted hover:text-foreground"
          >
            Xem tất cả
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/8">
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        {/* Grid 4 ô */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((project) => {
              const imageUrl = project.media
                ?.filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0]?.file?.url ?? null;
              const location = [project?.district?.name, project?.province?.name].filter(Boolean).join(", ");

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={project.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2 size={32} className="text-foreground-muted/40" />
                      </div>
                    )}
                    {project.status && statusLabel[project.status] && (
                      <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                        {statusLabel[project.status]}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="font-serif text-lg font-semibold leading-tight text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
                      {project.name}
                    </h3>
                    {project.developer && (
                      <p className="text-xs text-foreground-muted">
                        Chủ đầu tư: {project.developer}
                      </p>
                    )}
                    {location && (
                      <p className="flex items-center gap-1 text-sm text-foreground-muted mt-auto">
                        <MapPin size={14} className="shrink-0" />
                        <span className="line-clamp-1">{location}</span>
                      </p>
                    )}
                    {project._count?.properties != null && project._count.properties > 0 && (
                      <p className="text-xs text-foreground-muted">
                        {project._count.properties} bất động sản
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-center">
            <p className="text-sm text-foreground-muted">Chưa có dự án nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
