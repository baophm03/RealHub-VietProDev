"use client";

import { useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useGetApiPropertyMedia } from "@/lib/api/endpoints/properties";

interface PropertyCardImageProps {
  propertyId: string;
  alt: string;
  className?: string;
  iconSize?: number;
}

export function PropertyCardImage({
  propertyId,
  alt,
  className,
  iconSize = 32,
}: PropertyCardImageProps) {
  const { data: mediaData } = useGetApiPropertyMedia(propertyId);

  const url = useMemo(() => {
    const raw = mediaData as any;
    const items: any[] = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
    if (items.length === 0) return null;
    const imageItem = items
      .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
    return imageItem?.file?.url ?? null;
  }, [mediaData]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-surface-muted ${className ?? ""}`}>
        <div className="flex flex-col items-center gap-2 text-foreground-muted">
          <ImageIcon size={iconSize} />
          <span className="text-xs">Không có hình ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
    />
  );
}
