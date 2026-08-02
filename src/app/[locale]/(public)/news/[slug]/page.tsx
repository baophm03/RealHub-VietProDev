import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { prefetchGetApiNewsIdQuery, prefetchGetApiNewsQuery } from "@/lib/api/endpoints/news";
import { NewsDetailView } from "./_components/news-detail-view";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();

  await prefetchGetApiNewsIdQuery(queryClient, slug);
  await prefetchGetApiNewsQuery(queryClient, { limit: "4" } as any);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewsDetailView />
    </HydrationBoundary>
  );
}
