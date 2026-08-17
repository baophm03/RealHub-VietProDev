import { getApiNews } from "@/lib/api/endpoints/news";
import type { GetNewsResponse, News } from "@/lib/api/types/news";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export async function FeaturedNews() {
  let newsList: News[] = [];

  try {
    const res = await getApiNews({ limit: "6" } as any);
    newsList = ((res as unknown as GetNewsResponse)?.data) || [];
  } catch {
    // Keep empty
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
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
              Cập nhật xu hướng, phân tích thị trường và tin tức bất động sản mới nhất.
            </p>
          </div>
          <Link
            href="/news"
            className="group inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium shadow-xs transition-all hover:bg-muted hover:text-foreground"
          >
            Xem tất cả
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/8">
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        {/* Grid 2 hàng x 3 cột = 6 ô */}
        {newsList.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {newsList.slice(0, 6).map((news) => {
              const imageUrl = news.thumbnail?.url ?? null;
              return (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={news.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <CalendarDays size={32} className="text-foreground-muted/40" />
                      </div>
                    )}
                    {news.category?.name && (
                      <span className="absolute top-3 left-3 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                        {news.category.name}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="font-serif text-base font-semibold leading-tight text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
                      {news.title}
                    </h3>
                    {news.description && (
                      <p className="text-sm text-foreground-muted line-clamp-2">
                        {news.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-foreground-muted mt-auto pt-2">
                      <CalendarDays size={13} className="shrink-0" />
                      <span>{formatDate(news.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
