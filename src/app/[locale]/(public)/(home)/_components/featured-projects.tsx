import { getApiProjects } from "@/lib/api/endpoints/projects";
import type { GetProjectsResponse, Project } from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FeaturedProjectsCarousel } from "@/app/[locale]/(public)/(home)/_components/featured-projects-carousel";

export async function FeaturedProjects() {
  const t = await getTranslations("public.home");
  const tc = await getTranslations("public.common");
  let projects: Project[] = [];

  try {
    const res = await getApiProjects({ limit: "10" } as any);
    projects = ((res as unknown as GetProjectsResponse)?.data) || [];
  } catch {
    // Keep empty
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              {t("projectsEyebrow")}
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
              {t("projectsTitle")}
            </h2>
            <p className="max-w-[48ch] text-sm leading-relaxed text-foreground-muted">
              {t("projectsDesc")}
            </p>
          </div>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            {tc("viewAll")}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Carousel */}
        {projects.length > 0 && (
          <FeaturedProjectsCarousel projects={projects} />
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="flex items-center justify-center py-20 text-center">
            <p className="text-sm text-foreground-muted">{t("noProjects")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
