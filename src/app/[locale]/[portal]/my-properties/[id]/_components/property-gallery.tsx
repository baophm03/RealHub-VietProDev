"use client";

import { useState, useMemo } from "react";
import { Camera } from "lucide-react";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";

interface PropertyGalleryProps {
  mediaItems: any[];
  title?: string;
}

export function PropertyGallery({ mediaItems, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = useMemo<LightboxImage[]>(
    () =>
      mediaItems.map((m: any) => ({
        id: m.id,
        url: m.file?.url ?? "",
        alt: m.caption || title || "",
        caption: m.caption,
      })),
    [mediaItems, title],
  );

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  if (mediaItems.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted">
        <div className="flex flex-col items-center gap-2 text-foreground-muted">
          <Camera size={32} />
          <p className="text-sm">Chưa có hình ảnh cho bất động sản này</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
        {mediaItems.slice(0, 5).map((img: any, i: number) => {
          const url = img.file?.url;
          const isPrimary = img.isPrimary;
          const hasMore = mediaItems.length > 5 && i === 4;
          return (
            <div
              key={img.id || i}
              onClick={() => (hasMore ? openLightbox(0) : openLightbox(i))}
              className={`relative group cursor-pointer ${i === 0 ? "md:col-span-2 md:row-span-2" : ""} ${i >= 1 ? "hidden md:block" : ""}`}
            >
              {url ? (
                <img
                  src={url}
                  alt={img.caption || title || ""}
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                  <Camera size={32} className="text-foreground-muted" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
              {isPrimary && i === 0 && (
                <div className="absolute top-4 right-4 rounded-lg bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  Ảnh chính
                </div>
              )}
              {hasMore && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                  <span className="font-serif text-xl font-medium text-white">+{mediaItems.length - 5} Ảnh</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={lightboxImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
