import { getApiNews } from "@/lib/api/endpoints/news";
import type { GetNewsResponse, News } from "@/lib/api/types/news";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/components/shared/news-card";
import { NewsCarousel } from "@/components/shared/news-carousel";

export async function FeaturedNews() {
  let newsList: News[] = [];

  try {
    const res = await getApiNews({ limit: "12" } as any);
    newsList = ((res as unknown as GetNewsResponse)?.data) || [];
  } catch {
    // Keep empty
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Tin tức
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
              Tin tức bất động sản
            </h2>
            <p className="max-w-[48ch] text-sm leading-relaxed text-foreground-muted">
              Cập nhật, phân tích thị trường và tin tức bất động sản mới nhất.
            </p>
          </div>
          <Link
            href="/news/all"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            Xem tất cả
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {newsList.length > 0 ? (
          <div className="flex flex-col gap-12">
            <NewsCarousel newsList={newsList.slice(0, 6)} />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {newsList.slice(6, 12).map((news) => (
                <NewsCard key={news.id} article={news} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-center">
            <p className="text-sm text-foreground-muted">Chưa có tin tức nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
