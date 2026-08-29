"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Project } from "@/lib/api/types/projects";
import { ProjectCard } from "@/components/shared/project-card";

import "swiper/css";
import "swiper/css/pagination";

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
        spaceBetween={32}
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
        {projects.map((project) => (
          <SwiperSlide key={project.id} className="!h-auto">
            <ProjectCard project={project} className="h-full" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
