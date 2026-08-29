"use client";

import type { News } from "@/lib/api/types/news";
import { Link } from "@/i18n/navigation";
import { ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function formatNewsDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return iso;
  }
}

interface NewsCardProps {
  article: News;
  className?: string;
}

export function NewsCard({ article, className }: NewsCardProps) {
  const imageUrl = article.thumbnail?.url ?? null;

  return (
    <Link
      href={`/news/${article.category?.code ?? "uncategorized"}/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={article.title}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.endsWith("/image-fallback.jpg")) return;
              img.src = "/image-fallback.jpg";
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/image-fallback.jpg"
            alt={article.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        {/* Badge + Date */}
        <div className="flex items-center gap-2 pb-3 flex-wrap">
          {article.category?.name && (
            <span className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              {article.category.name}
            </span>
          )}
          <span className="text-xs text-foreground-muted">
            {formatNewsDate(article.createdAt)}
          </span>
        </div>

        {/* Title + Description */}
        <div className="flex flex-col gap-2 pb-4">
          <h3 className="font-serif text-lg font-semibold leading-tight text-black line-clamp-2 group-hover:text-black/80 transition-colors">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-sm text-foreground-muted line-clamp-2">
              {article.description}
            </p>
          )}
        </div>

        {/* Footer: author + read more */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border">
          <span className="flex items-center gap-1.5 text-[13px] text-foreground-muted truncate">
            <User size={14} className="shrink-0" />
            {article.creator?.fullName ?? "Ẩn danh"}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary transition-colors group-hover:text-primary/80">
            Đọc tiếp
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
