"use client";

import { useSearchParams } from "next/navigation";
import { useGetApiNews } from "@/lib/api/endpoints/news";
import type { GetNewsResponse } from "@/lib/api/types/news";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar, Newspaper, Spinner } from "@phosphor-icons/react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function NewsGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  const { data: newsData, isLoading: isLoadingNews } = useGetApiNews(
    category ? { categoryNewsId: category, limit: "100" } : { limit: "100" },
  );

  const news = (newsData as unknown as GetNewsResponse)?.data ?? [];

  const sorted = [...news].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const featured = sorted.slice(0, 2);
  const regular = sorted.slice(2);

  if (isLoadingNews) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} className="animate-spin text-foreground-muted" />
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Newspaper size={32} className="text-foreground-muted" />
        <p className="text-base text-foreground-muted">Chưa có bài viết nào.</p>
      </div>
    );
  }

  return (
    <>
      {/* Featured articles */}
      {featured.length > 0 && (
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {featured.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FALLBACK_IMAGE}
                  alt={article.title}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {article.category && (
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                      {article.category.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="font-serif text-xl font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {article.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">
                  {article.description ?? ""}
                </p>
                <div className="mt-auto flex items-center gap-4 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(article.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Regular articles */}
      {regular.length > 0 && (
        <>
          <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
            Bài viết khác
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FALLBACK_IMAGE}
                    alt={article.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {article.category && (
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground backdrop-blur-sm">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h3 className="font-serif text-base font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">
                    {article.description ?? ""}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(article.createdAt)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
