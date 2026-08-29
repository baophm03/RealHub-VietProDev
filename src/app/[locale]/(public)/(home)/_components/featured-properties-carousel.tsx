"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Property } from "@/lib/api/types/properties";
import { PropertyCard } from "@/components/shared/property-card";

import "swiper/css";
import "swiper/css/pagination";

interface FeaturedPropertiesCarouselProps {
  properties: Property[];
  imageMap: Map<string, string | null>;
}

export function FeaturedPropertiesCarousel({
  properties,
  imageMap,
}: FeaturedPropertiesCarouselProps) {
  if (properties.length === 0) return null;

  return (
    <div className="featured-properties-carousel relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        loop={properties.length > 4}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="!pb-12"
      >
        {properties.map((prop) => (
          <SwiperSlide key={prop.id} className="!h-auto">
            <PropertyCard
              property={prop}
              imageUrl={imageMap.get(prop.id) ?? null}
              className="h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
