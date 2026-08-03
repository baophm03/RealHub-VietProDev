"use client";

import { useSearchParams } from "next/navigation";
import { useGetApiNewsCategories } from "@/lib/api/endpoints/news-categories";
import type { GetNewsCategoriesResponse } from "@/lib/api/types/news";
import { Link } from "@/i18n/navigation";

export function NewsFilter() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  const { data: categoriesData } = useGetApiNewsCategories({ limit: "100" });
  const categories = (categoriesData as unknown as GetNewsCategoriesResponse)?.data ?? [];

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <Link
        href="/news"
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!category
          ? "bg-primary text-primary-foreground"
          : "bg-surface-muted text-foreground-muted hover:bg-border/40"
          }`}
      >
        Tất cả
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/news?category=${cat.id}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === cat.id
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
