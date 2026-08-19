import { setRequestLocale } from "next-intl/server";
import { getApiNewsCategories } from "@/lib/api/endpoints/news-categories";
import { getApiNews } from "@/lib/api/endpoints/news";
import type {
  GetNewsResponse,
  GetNewsCategoriesResponse,
  News,
  NewsCategory,
} from "@/lib/api/types/news";
import { NewsFilter } from "../_components/news-filter";
import { NewsGrid } from "../_components/news-grid";

export const ALL_SLUG = "all";

type Props = {
  params: Promise<{ locale: string; categoryId: string }>;
};

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateStaticParams() {
  const catsRes = await getApiNewsCategories({ limit: "100" });
  const cats =
    (catsRes as unknown as GetNewsCategoriesResponse)?.data ?? ([] as NewsCategory[]);
  return ["vi", "en"].flatMap((locale) => [
    { locale, categoryId: ALL_SLUG },
    ...cats.map((c) => ({ locale, categoryId: c.id })),
  ]);
}

export default async function NewsListPage({ params }: Props) {
  const { locale, categoryId } = await params;
  setRequestLocale(locale);

  const isAll = categoryId === ALL_SLUG;

  const [newsRes, categoriesRes] = await Promise.all([
    isAll
      ? getApiNews({ limit: "100" })
      : getApiNews({ categoryNewsId: categoryId, limit: "100" }),
    getApiNewsCategories({ limit: "100" }),
  ]);

  const news = (newsRes as unknown as GetNewsResponse)?.data ?? ([] as News[]);
  const categories =
    (categoriesRes as unknown as GetNewsCategoriesResponse)?.data ??
    ([] as NewsCategory[]);

  const active = isAll
    ? undefined
    : categories.find((c) => c.id === categoryId);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Tin tức
        </span>
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          {active ? active.name : "Tin tức bất động sản"}
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
          Cập nhật xu hướng, phân tích thị trường và hướng dẫn đầu tư bất động sản từ đội ngũ RealHub.
        </p>
      </div>

      <NewsFilter categories={categories} activeCategory={isAll ? undefined : categoryId} />
      <NewsGrid news={news} />
    </div>
  );
}
