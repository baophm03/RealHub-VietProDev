import type { NewsCategory } from "@/lib/api/types/news";
import { Link } from "@/i18n/navigation";

type Props = {
  categories: NewsCategory[];
  activeCategory?: string;
};

export function NewsFilter({ categories, activeCategory }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <Link
        href="/news/all"
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!activeCategory
          ? "bg-primary text-primary-foreground"
          : "bg-surface-muted text-foreground-muted hover:bg-border/40"
          }`}
      >
        Tất cả
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/news/${cat.code}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeCategory === cat.code
            ? "bg-primary text-primary-foreground"
            : "bg-surface-muted text-foreground-muted hover:bg-border/40"
            }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
