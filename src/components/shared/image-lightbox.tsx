"use client";

import { useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

export interface LightboxImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string | null;
}

export interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
}

export function ImageLightbox({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
}: ImageLightboxProps) {
  const total = images.length;
  const current = useMemo(() => images[index], [images, index]);

  const goPrev = useCallback(() => {
    if (total === 0) return;
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    if (total === 0) return;
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, goPrev, goNext, onOpenChange]);

  if (total === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 supports-backdrop-filter:backdrop-blur-sm" />
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 top-0 left-0 grid max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-transparent p-0 shadow-none outline-none sm:max-w-none"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>

          {/* Prev button */}
          {total > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next button */}
          {total > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image */}
          <div className="flex flex-col items-center justify-center gap-4 px-4 pb-24 pt-4 sm:px-16">
            {current?.url ? (
              <img
                src={current.url}
                alt={current.alt ?? ""}
                className="max-h-[80vh] max-w-full object-contain"
              />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-white/5">
                <ImageIcon size={48} className="text-white/40" />
              </div>
            )}

            {/* Caption + counter */}
            <div className="flex flex-col items-center gap-1 text-center">
              {current?.caption && (
                <p className="text-sm text-white/80">{current.caption}</p>
              )}
              {total > 1 && (
                <p className="text-xs text-white/50 tabular-nums">
                  {index + 1} / {total}
                </p>
              )}
            </div>
          </div>

          {/* Thumbnails strip */}
          {total > 1 && (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 overflow-x-auto p-4">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => onIndexChange(i)}
                  className={`relative size-14 shrink-0 overflow-hidden rounded-md border-2 transition-all ${i === index ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt ?? ""}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
