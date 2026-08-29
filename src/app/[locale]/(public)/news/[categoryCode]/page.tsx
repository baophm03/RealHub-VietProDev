import { setRequestLocale } from "next-intl/server";
import { getApiNewsCategories } from "@/lib/api/endpoints/news-categories";
import { getApiNews, getApiNewsCategoryCode } from "@/lib/api/endpoints/news";
import type {
  GetNewsResponse,
  GetNewsCategoriesResponse,
  News,
  NewsCategory,
} from "@/lib/api/types/news";
import { NewsFilter } from "../_components/news-filter";
import { NewsGrid } from "../_components/news-grid";
import { RevealSection } from "@/components/shared/reveal-section";
import { PageBanner } from "@/components/shared/page-banner";

export const ALL_SLUG = "all";

type Props = {
  params: Promise<{ locale: string; categoryCode: string }>;
};

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateStaticParams() {
  const catsRes = await getApiNewsCategories({ limit: "100" });
  const cats =
    (catsRes as unknown as GetNewsCategoriesResponse)?.data ?? ([] as NewsCategory[]);
  return ["vi", "en"].flatMap((locale) => [
    { locale, categoryCode: ALL_SLUG },
    ...cats.map((c) => ({ locale, categoryCode: c.code })),
  ]);
}

export default async function NewsListPage({ params }: Props) {
  const { locale, categoryCode } = await params;
  setRequestLocale(locale);

  const isAll = categoryCode === ALL_SLUG;

  const [newsRes, categoriesRes] = await Promise.all([
    isAll
      ? getApiNews({ limit: "100" })
      : getApiNewsCategoryCode(categoryCode, { limit: "100" }),
    getApiNewsCategories({ limit: "100" }),
  ]);

  const categories = (categoriesRes as unknown as GetNewsCategoriesResponse)?.data ?? ([] as NewsCategory[]);
  const news = (newsRes as unknown as GetNewsResponse)?.data ?? ([] as News[]);

  const active = isAll ? undefined : categories.find((c) => c.code === categoryCode);

  return (
    <>
      <PageBanner
        title={active ? active.name : "Tin tức bất động sản"}
        description="Cập nhật xu hướng, phân tích thị trường."
        backgroundImage="/background/news.jpg"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: active ? active.name : "Tin tức" }]}
      />

      <div className="container py-12 md:py-16">
        <RevealSection>
          <NewsFilter categories={categories} activeCategory={isAll ? undefined : categoryCode} />
        </RevealSection>

        <RevealSection>
          <NewsGrid news={news} />
        </RevealSection>
      </div>
    </>
  );
}
