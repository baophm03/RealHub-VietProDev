import { setRequestLocale } from "next-intl/server";
import { getApiProjects } from "@/lib/api/endpoints/projects";
import type { GetProjectsResponse } from "@/lib/api/types/projects";
import { RevealSection } from "@/components/shared/reveal-section";
import { ProjectCard } from "@/components/shared/project-card";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projectsRes = await getApiProjects({ limit: "100" });
  const projects = (projectsRes as unknown as GetProjectsResponse)?.data ?? [];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <RevealSection>
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
      </RevealSection>

      <RevealSection>
        <p className="mb-6 text-sm text-foreground-muted">
          Hiển thị <span className="font-medium text-foreground">{projects.length}</span> dự án
        </p>
      </RevealSection>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Chưa có dự án nào.</p>
        </div>
      ) : (
        <RevealSection>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </RevealSection>
      )}
    </div>
  );
}
