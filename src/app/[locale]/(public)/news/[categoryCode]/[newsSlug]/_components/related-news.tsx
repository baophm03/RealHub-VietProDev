import { ArrowRight, Calendar, ImageIcon, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { News } from "@/lib/api/types/news";

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
  iconSize = 20,
}: {
  url?: string | null;
  alt: string;
  className?: string;
  iconSize?: number;
}) {
  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-surface-muted ${className ?? ""}`}>
        <ImageIcon size={iconSize} className="text-foreground-muted" />
      </div>
    );
  }
  return (
    <img src={url} alt={alt} className={className} loading="lazy" />
  );
}

interface RelatedNewsProps {
  news: News[];
  categoryCode: string;
}

export function RelatedNews({ news, categoryCode }: RelatedNewsProps) {
  if (news.length === 0) return null;

  return (
    <div className="w-full lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[1rem] border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="font-serif text-lg font-semibold tracking-tight">
            Bài viết liên quan
          </h2>
        </div>

        {/* List items */}
        <div className="flex flex-col">
          {news.map((n, i) => {
            const catCode = n.category?.code ?? categoryCode;
            return (
              <Link
                key={n.id}
                href={`/news/${catCode}/${n.slug}`}
                className="group -mx-2 flex gap-3 rounded-lg px-2 py-3 transition-colors duration-300 hover:bg-surface-muted/40"
              >
                {/* Image */}
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <NewsImage
                    url={n.thumbnail?.url}
                    alt={n.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    iconSize={20}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  {n.category && (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-primary">
                      {n.category.name}
                    </span>
                  )}
                  <h3 className="text-sm font-medium leading-snug tracking-tight text-black/80 transition-colors group-hover:text-primary line-clamp-2">
                    {n.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-3 text-[11px] text-black/50">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(n.createdAt)}
                    </span>
                    {n.creator && (
                      <span className="flex items-center gap-1">
                        <User size={10} /> {n.creator.fullName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={14}
                  className="mt-1 shrink-0 text-black/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
