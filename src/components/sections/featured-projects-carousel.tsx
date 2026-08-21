"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Project } from "@/lib/api/types/projects";
import { Link } from "@/i18n/navigation";
import { MapPin, ImageIcon } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

function getProjectLocation(project: Project): string {
  const parts: string[] = [];
  if (project.district?.name) parts.push(project.district.name);
  if (project.province?.name) parts.push(project.province.name);
  return parts.length > 0 ? parts.join(", ") : "Đang cập nhật";
}

function getProjectScale(project: Project): string {
  const count = project._count?.properties;
  if (count && count > 0) return `${count.toLocaleString("vi-VN")} BĐS`;
  return "Đang cập nhật";
}

function getProjectImage(project: Project): string | null {
  const mediaList = project.media;
  if (!mediaList || mediaList.length === 0) return null;
  const imageItem = mediaList
    .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return imageItem?.file?.url ?? null;
}

interface FeaturedProjectsCarouselProps {
  projects: Project[];
}

export function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
  if (projects.length === 0) return null;

  return (
    <div className="featured-projects-carousel relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={24}
        loop={projects.length > 3}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="!pb-12"
      >
        {projects.map((project) => {
          const imageUrl = getProjectImage(project);
          return (
            <SwiperSlide key={project.id} className="!h-auto">
              <Link
                href={`/projects/${project.code}`}
                className="group/project flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/project:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                      <div className="flex flex-col items-center gap-2 text-foreground-muted">
                        <ImageIcon size={32} />
                        <span className="text-xs">Không có hình ảnh</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight transition-colors group-hover/project:text-primary">
                    {project.name}
                  </h3>

                  <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{getProjectLocation(project)}</span>
                  </p>

                  <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Giá từ</span>
                      <span className="font-semibold text-primary">Đang cập nhật</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Quy mô</span>
                      <span className="font-medium text-foreground">{getProjectScale(project)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Chủ đầu tư</span>
                      <span className="font-medium text-foreground">{project.developer ?? "Đang cập nhật"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-muted">Bàn giao</span>
                      <span className="font-medium text-foreground">Đang cập nhật</span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
