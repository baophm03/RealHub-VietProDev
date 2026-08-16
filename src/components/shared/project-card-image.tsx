"use client";

import { useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useGetApiProjectId } from "@/lib/api/endpoints/projects";

interface ProjectCardImageProps {
  projectId: string;
  alt: string;
  className?: string;
  iconSize?: number;
}

export function ProjectCardImage({
  projectId,
  alt,
  className,
  iconSize = 32,
}: ProjectCardImageProps) {
  const { data: projectData } = useGetApiProjectId(projectId);

  const url = useMemo(() => {
    const raw = projectData as any;
    const project = raw?.data ?? raw;
    const mediaList = project?.media as any[] | undefined;
    if (!mediaList || mediaList.length === 0) return null;
    const imageItem = mediaList
      .filter((m) => m.type === "IMAGE" || m.file?.mimeType?.startsWith("image/"))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
    return imageItem?.file?.url ?? null;
  }, [projectData]);

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
