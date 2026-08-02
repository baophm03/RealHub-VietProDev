import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";
import { prefetchGetApiNewsCategoriesQuery } from "@/lib/api/endpoints/news-categories";
import { prefetchGetApiNewsQuery } from "@/lib/api/endpoints/news";
import { NewsFilter } from "./_components/news-filter";
import { NewsGrid } from "./_components/news-grid";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
};

export default async function NewsPage({ searchParams, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;

  const queryClient = new QueryClient();

  await prefetchGetApiNewsCategoriesQuery(queryClient, { limit: "100" } as any);
  await prefetchGetApiNewsQuery(
    queryClient,
    category ? { categoryNewsId: category, limit: "100" } : { limit: "100" } as any,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Tin tức
          </span>
          <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Tin tức bất động sản
          </h1>
          <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
            Cập nhật xu hướng, phân tích thị trường và hướng dẫn đầu tư bất động sản từ đội ngũ RealHub.
          </p>
        </div>

        <NewsFilter />
        <NewsGrid />
      </div>
    </HydrationBoundary>
  );
}
