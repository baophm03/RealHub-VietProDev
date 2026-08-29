import { Calendar, User } from "lucide-react";
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

interface NewsContentProps {
  article: News;
  renderContent: (content: string) => React.ReactNode;
}

export function NewsContent({ article, renderContent }: NewsContentProps) {
  return (
    <div className="rounded-[1rem] border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] md:p-8">
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
        <div className="mb-4 flex items-center gap-4 text-[13px] text-black/70">
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {formatDate(article.createdAt)}
          </span>
          {article.creator && (
            <span className="flex items-center gap-1">
              <User size={13} /> {article.creator.fullName}
            </span>
          )}
        </div>
        {article.description && (
          <div className="flex">
            <div className="w-1 shrink-0 bg-primary" />
            <div className="flex-1 bg-surface-muted/50 p-4">
              <p className="text-base leading-relaxed text-black/80">
                {article.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {article.content ? (
        <div className="mb-12 text-base text-black/80">{renderContent(article.content)}</div>
      ) : (
        <div className="mb-12 text-base text-black/80">Nội dung đang được cập nhật.</div>
      )}
    </div>
  );
}
