"use client";

import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Calendar, Spinner, Image as ImageIcon } from "@phosphor-icons/react";
import { useGetApiNewsId, useGetApiNews } from "@/lib/api/endpoints/news";
import type {
  GetNewsItemResponse,
  GetNewsResponse,
  News,
} from "@/lib/api/types/news";

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

function NewsImage({
  url,
  alt,
  className,
  iconSize = 28,
}: {
  url?: string | null;
  alt: string;
  className?: string;
  iconSize?: number;
}) {
  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-surface-muted ${className ?? ""}`}>
        <ImageIcon size={iconSize} weight="duotone" className="text-foreground-muted" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={className} loading="lazy" />
  );
}

function renderContent(content: string) {
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg prose-img:my-4"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function NewsDetailView() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: articleData, isLoading } = useGetApiNewsId(slug);
  const { data: relatedData } = useGetApiNews({ limit: "4" });

  const article = (articleData as unknown as GetNewsItemResponse)?.data ?? null;
  const relatedNews = (((relatedData as unknown as GetNewsResponse)?.data) ?? [])
    .filter((n: News) => n.id !== slug)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} className="animate-spin text-foreground-muted" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-8 md:py-12 lg:px-12">
        <Link
          href="/news"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Quay lại tin tức
        </Link>
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="mb-2 font-serif text-2xl font-semibold">Không tìm thấy bài viết</h1>
          <p className="text-sm text-foreground-muted">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-8 md:py-12 lg:px-12">
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> Quay lại tin tức
      </Link>

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          {article.category && (
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {article.category.name}
            </span>
          )}
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {article.title}
          </h1>
          <p className="mb-4 text-base leading-relaxed text-foreground-muted">
            {article.description ?? ""}
          </p>
          <div className="flex items-center gap-4 text-xs text-foreground-muted">
            {article.creator && (
              <span className="font-medium text-foreground">{article.creator.fullName}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDate(article.createdAt)}
            </span>
          </div>
        </div>

        {/* Featured image */}
        <div className="mb-8 aspect-[16/9] overflow-hidden rounded-lg">
          <NewsImage
            url={article.thumbnail?.url}
            alt={article.title}
            className="size-full object-cover"
          />
        </div>

        {/* Content */}
        {article.content ? (
          <div className="mb-12">{renderContent(article.content)}</div>
        ) : (
          <div className="mb-12 text-sm text-foreground-muted">Nội dung đang được cập nhật.</div>
        )}
      </div>

      {/* Related news */}
      {relatedNews.length > 0 && (
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
            Bài viết liên quan
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNews.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <NewsImage
                    url={n.thumbnail?.url}
                    alt={n.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    iconSize={24}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  {n.category && (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-primary">
                      {n.category.name}
                    </span>
                  )}
                  <h3 className="font-serif text-base font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {n.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(n.createdAt)}
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
        </div>
      )}
    </div>
  );
}
