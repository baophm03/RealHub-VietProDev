"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { News } from "@/lib/api/types/news";
import { formatNewsDate } from "@/components/shared/news-card";

import "swiper/css";
import "swiper/css/pagination";

interface FeaturedNewsCarouselProps {
  newsList: News[];
}

export function FeaturedNewsCarousel({ newsList }: FeaturedNewsCarouselProps) {
  if (newsList.length === 0) return null;

  return (
    <div className="featured-news-carousel relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={32}
        loop={newsList.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        className="!pb-12"
      >
        {newsList.map((news) => (
          <SwiperSlide key={news.id} className="!h-auto">
            <Link
              href={`/news/${news.category?.code ?? "uncategorized"}/${news.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] sm:flex-row"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface-muted sm:w-[720px]">
                <img
                  src={news.thumbnail?.url || "/image-fallback.jpg"}
                  alt={news.title || ""}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src.endsWith("/image-fallback.jpg")) return;
                    img.src = "/image-fallback.jpg";
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
                  {news.category?.name && (
                    <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                      {news.category.name}
                    </span>
                  )}
                  <span>{formatNewsDate(news.createdAt)}</span>
                </div>

                <h3 className="font-serif text-4xl font-semibold leading-tight tracking-tighter line-clamp-2 transition-colors group-hover:text-black/80">
                  {news.title || ""}
                </h3>

                {news.description && (
                  <p className="text-base leading-relaxed text-foreground-muted line-clamp-3">
                    {news.description}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2.5">
                  {news.creator?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={news.creator.avatarUrl}
                      alt={news.creator.fullName}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted">
                      <User size={18} className="text-foreground-muted" />
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {news.creator?.fullName ?? "Ẩn danh"}
                    </span>
                    {news.creator?.role?.name && (
                      <span className="text-xs text-foreground-muted">
                        {news.creator.role.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
