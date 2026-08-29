import { setRequestLocale } from "next-intl/server";
import { getApiProjects } from "@/lib/api/endpoints/projects";
import type { GetProjectsResponse } from "@/lib/api/types/projects";
import { RevealSection } from "@/components/shared/reveal-section";
import { ProjectCard } from "@/components/shared/project-card";
import { PageBanner } from "@/components/shared/page-banner";

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
    <>
      <PageBanner
        title="Dự án bất động sản"
        description="Khám phá các dự án bất động sản nổi bật trong hệ sinh thái RealHub."
        backgroundImage="/background/projects.jpg"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dự án" }]}
      />

      <div className="container py-10">
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
    </>
  );
}
