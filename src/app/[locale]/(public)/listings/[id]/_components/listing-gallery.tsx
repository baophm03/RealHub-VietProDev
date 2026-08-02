"use client";

import { useState } from "react";
import { Camera } from "@phosphor-icons/react";

interface ListingGalleryProps {
  images: string[];
  propertyCode?: string;
}

export function ListingGallery({ images, propertyCode }: ListingGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const gallery = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
      <div
        className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
        onClick={() => setActiveImage(0)}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${gallery[activeImage]})` }}
        />
        {propertyCode && (
          <div className="absolute top-4 right-4 z-10">
            <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm bg-surface/90 backdrop-blur-sm text-primary">
              {propertyCode}
            </span>
          </div>
        )}
      </div>
      {gallery.slice(1, 5).map((img, i) => (
        <div
          key={i}
          className="hidden md:block relative group cursor-pointer overflow-hidden"
          onClick={() => setActiveImage(i + 1)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${img})` }}
          />
          {i === 3 && gallery.length > 5 && (
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-white font-serif text-xl font-medium">
                +{gallery.length - 5} Ảnh
              </span>
            </div>
          )}
        </div>
      ))}
      {gallery.length < 5 &&
        Array.from({ length: 5 - gallery.length }).map((_, i) => (
          <div key={`placeholder-${i}`} className="hidden md:block relative overflow-hidden bg-surface-muted" />
        ))}
    </div>
  );
}
