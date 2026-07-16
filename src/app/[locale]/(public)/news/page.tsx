"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockNews, mockNewsCategories } from "@/lib/mock/news";
import { Eye, ArrowRight, Calendar } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filtered = mockNews.filter((n) => {
    if (selectedCategory !== "Tất cả" && n.category !== selectedCategory) return false;
    return true;
  });

  const featured = filtered.filter((n) => n.featured);
  const regular = filtered.filter((n) => !n.featured);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 md:py-16 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 flex flex-col gap-4"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Tin tức
        </span>
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Tin tức bất động sản
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
          Cập nhật xu hướng, phân tích thị trường và hướng dẫn đầu tư bất động sản từ đội ngũ RealHub.
        </p>
      </motion.div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {mockNewsCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-surface-muted text-foreground-muted hover:bg-border/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured articles */}
      {featured.length > 0 && (
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {featured.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/news/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h2 className="font-serif text-xl font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {article.title}
                  </h2>
                  <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">
                    {article.description}
                  </p>
                  <div className="mt-auto flex items-center gap-4 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {article.publishedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {article.views} lượt xem
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Regular articles */}
      {regular.length > 0 && (
        <>
          <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">Bài viết khác</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground backdrop-blur-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <h3 className="font-serif text-base font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">
                      {article.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {article.publishedDate}
                      </span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-base text-foreground-muted">Không tìm thấy bài viết phù hợp.</p>
        </div>
      )}
    </div>
  );
}
