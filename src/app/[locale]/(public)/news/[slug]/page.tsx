"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { mockNews } from "@/lib/mock/news";
import { ArrowLeft, Eye, Calendar, ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = mockNews.find((n) => n.slug === slug) ?? mockNews[0];
  const relatedNews = mockNews.filter((n) => n.id !== article.id).slice(0, 3);

  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, idx) => {
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <h2 key={idx} className="mt-6 mb-3 font-serif text-xl font-semibold text-foreground">
            {paragraph.replace(/\*\*/g, "")}
          </h2>
        );
      }
      if (paragraph.startsWith("- ")) {
        return (
          <ul key={idx} className="mb-4 list-disc space-y-1 pl-6">
            {paragraph.split("\n").map((item, i) => (
              <li key={i} className="text-sm leading-relaxed text-foreground-muted">
                {item.replace("- ", "")}
              </li>
            ))}
          </ul>
        );
      }
      if (paragraph.match(/^\d+\./)) {
        return (
          <ol key={idx} className="mb-4 list-decimal space-y-1 pl-6">
            {paragraph.split("\n").map((item, i) => (
              <li key={i} className="text-sm leading-relaxed text-foreground-muted">
                {item.replace(/^\d+\.\s*/, "")}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <p key={idx} className="mb-4 text-sm leading-relaxed text-foreground-muted">
          {paragraph}
        </p>
      );
    });
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {article.category}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {article.title}
          </h1>
          <p className="mb-4 text-base leading-relaxed text-foreground-muted">{article.description}</p>
          <div className="flex items-center gap-4 text-xs text-foreground-muted">
            <span className="font-medium text-foreground">{article.author}</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {article.publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {article.views} lượt xem
            </span>
          </div>
        </motion.div>

        {/* Featured image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 aspect-[16/9] overflow-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${article.image})` }}
        />

        {/* Content */}
        <div className="mb-12">{renderContent(article.content)}</div>

        {/* Share */}
        <div className="mb-12 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Chia sẻ:</span>
            <div className="flex gap-2">
              <button className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground-muted transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground-muted transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related news */}
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">Bài viết liên quan</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedNews.map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${n.image})` }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-[10px] font-medium uppercase tracking-wide text-primary">{n.category}</span>
                <h3 className="font-serif text-base font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {n.title}
                </h3>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {n.publishedDate}
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
    </div>
  );
}
