import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { prefetchGetApiProjectsQuery } from "@/lib/api/endpoints/projects";
import { ProjectsView } from "./_components/projects-view";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();

  await prefetchGetApiProjectsQuery(queryClient, { limit: "100" } as any);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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

        <ProjectsView />
      </div>
    </HydrationBoundary>
  );
}
