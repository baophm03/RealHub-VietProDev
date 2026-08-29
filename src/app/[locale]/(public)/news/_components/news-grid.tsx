import type { News } from "@/lib/api/types/news";
import { Newspaper } from "lucide-react";
import { NewsCard } from "@/components/shared/news-card";

export function NewsGrid({ news }: { news: News[] }) {
  const sorted = [...news].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Newspaper size={32} className="text-foreground-muted" />
        <p className="text-base text-foreground-muted">Chưa có bài viết nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
