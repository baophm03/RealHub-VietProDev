import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { prefetchGetApiProjectIdQuery, prefetchGetApiProjectsQuery } from "@/lib/api/endpoints/projects";
import { ProjectDetailView } from "./_components/project-detail-view";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();

  await prefetchGetApiProjectIdQuery(queryClient, slug);
  await prefetchGetApiProjectsQuery(queryClient, { limit: "10" } as any);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetailView />
    </HydrationBoundary>
  );
}
