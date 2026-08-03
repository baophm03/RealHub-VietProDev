"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import {
  UploadSimple,
  Trash,
  Star,
  CaretLeft,
  CaretRight,
  Image as ImageIcon,
  VideoCamera,
  FileText,
  Eye,
  PencilSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePostApiFileUpload } from "@/lib/api/endpoints/files";
import { customInstance } from "@/lib/api/mutator/custom-instance";
import { useGetApiProjectId, getGetApiProjectIdQueryKey } from "@/lib/api/endpoints/projects";

type MediaType = "IMAGE" | "VIDEO" | "TOUR_360" | "FLOOR_PLAN" | "DOCUMENT";

interface ProjectMediaManagerProps {
  projectId: string;
}

interface MediaItem {
  id: string;
  fileId: string;
  type: MediaType;
  sortOrder: number;
  isPrimary: boolean;
  caption?: string | null;
  file?: {
    id: string;
    originalFileName?: string;
    mimeType?: string;
    fileSize?: number;
    visibility?: string;
    objectKey?: string;
    url?: string;
  };
}

const mediaTypeLabels: Record<MediaType, string> = {
  IMAGE: "Ảnh",
  VIDEO: "Video",
  TOUR_360: "Tour 360",
  FLOOR_PLAN: "Mặt bằng",
  DOCUMENT: "Tài liệu",
};

const mediaTypeIcons: Record<MediaType, typeof ImageIcon> = {
  IMAGE: ImageIcon,
  VIDEO: VideoCamera,
  TOUR_360: Eye,
  FLOOR_PLAN: FileText,
  DOCUMENT: FileText,
};

function getMediaUrl(item: MediaItem): string | null {
  return item.file?.url ?? null;
}

function isImageType(item: MediaItem): boolean {
  if (item.type === "IMAGE") return true;
  if (item.file?.mimeType?.startsWith("image/")) return true;
  return false;
}

// Project media API helpers (until orval regenerates with project media endpoints)
const projectMediaApi = {
  list: (projectId: string) =>
    customInstance<MediaItem[]>({ url: `/api/projects/${projectId}/media`, method: "GET" }),
  create: (projectId: string, data: { fileId: string; type?: string; sortOrder?: number; isPrimary?: boolean; caption?: string }) =>
    customInstance<MediaItem>({ url: `/api/projects/${projectId}/media`, method: "POST", data }),
  update: (projectId: string, mediaId: string, data: Partial<{ type: string; sortOrder: number; isPrimary: boolean; caption: string }>) =>
    customInstance<MediaItem>({ url: `/api/projects/${projectId}/media/${mediaId}`, method: "PATCH", data }),
  delete: (projectId: string, mediaId: string) =>
    customInstance({ url: `/api/projects/${projectId}/media/${mediaId}`, method: "DELETE" }),
  reorder: (projectId: string, items: { id: string; sortOrder: number }[]) =>
    customInstance<MediaItem[]>({ url: `/api/projects/${projectId}/media/reorder`, method: "POST", data: { items } }),
  setPrimary: (projectId: string, mediaId: string) =>
    customInstance<MediaItem>({ url: `/api/projects/${projectId}/media/${mediaId}/set-primary`, method: "PATCH" }),
};

// Query keys for project media
const projectMediaQueryKey = (projectId: string) => [`/api/projects/${projectId}/media`] as const;

export function ProjectMediaManager({ projectId }: ProjectMediaManagerProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState("");

  const { data: projectData } = useGetApiProjectId(projectId);
  const project = (projectData as any)?.data;
  const mediaItems = useMemo(() => {
    const mediaList = project?.media as any[] | undefined;
    if (!mediaList) return [];
    return mediaList as MediaItem[];
  }, [project]);

  const sortedMedia = useMemo(
    () => [...mediaItems].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [mediaItems],
  );

  const { mutateAsync: uploadFile } = usePostApiFileUpload();

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: projectMediaQueryKey(projectId) });
    queryClient.invalidateQueries({ queryKey: getGetApiProjectIdQueryKey(projectId) });
  }, [queryClient, projectId]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);
      try {
        const currentMaxSort = sortedMedia.reduce(
          (max, item) => Math.max(max, item.sortOrder ?? 0),
          -1,
        );

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");

          const uploadResult = await uploadFile({
            data: {
              file,
              ownerType: "PROJECT",
              ownerId: projectId,
              visibility: "TENANT",
            },
          });

          const fileId = (uploadResult as any)?.id || (uploadResult as any)?.data?.id;
          if (!fileId) {
            console.error("Upload result:", uploadResult);
            toast.error(`Không thể upload file: ${file.name}`);
            continue;
          }

          await projectMediaApi.create(projectId, {
            fileId,
            type: isImage ? "IMAGE" : isVideo ? "VIDEO" : "DOCUMENT",
            sortOrder: currentMaxSort + 1 + i,
            isPrimary: sortedMedia.length === 0 && i === 0,
            caption: "",
          });
        }

        invalidateAll();
        toast.success(`Đã upload ${acceptedFiles.length} file thành công`);
      } catch (err) {
        console.error(err);
        toast.error("Có lỗi xảy ra khi upload file");
      } finally {
        setUploading(false);
      }
    },
    [sortedMedia, uploadFile, projectId, invalidateAll],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "video/mp4": [".mp4"],
      "application/pdf": [".pdf"],
    },
    maxSize: 50 * 1024 * 1024,
    disabled: uploading,
  });

  const handleDelete = async (mediaId: string) => {
    try {
      await projectMediaApi.delete(projectId, mediaId);
      invalidateAll();
      toast.success("Đã xóa media");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi xóa media");
    }
  };

  const handleSetPrimary = async (mediaId: string) => {
    try {
      await projectMediaApi.setPrimary(projectId, mediaId);
      invalidateAll();
      toast.success("Đã đặt làm ảnh chính");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi đặt ảnh chính");
    }
  };

  const handleSaveCaption = async (mediaId: string) => {
    try {
      await projectMediaApi.update(projectId, mediaId, { caption: captionValue });
      invalidateAll();
      setEditingCaptionId(null);
      toast.success("Đã cập nhật chú thích");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi cập nhật chú thích");
    }
  };

  const handleStartEditCaption = (item: MediaItem) => {
    setEditingCaptionId(item.id);
    setCaptionValue(item.caption || "");
  };

  const handleCancelEditCaption = () => {
    setEditingCaptionId(null);
    setCaptionValue("");
  };

  const handleMove = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedMedia.length) return;

    const newSorted = [...sortedMedia];
    [newSorted[index], newSorted[targetIndex]] = [newSorted[targetIndex], newSorted[index]];

    try {
      await projectMediaApi.reorder(
        projectId,
        newSorted.map((item, i) => ({ id: item.id, sortOrder: i })),
      );
      invalidateAll();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi sắp xếp lại media");
    }
  };

  const handleUpdateType = async (mediaId: string, type: MediaType) => {
    try {
      await projectMediaApi.update(projectId, mediaId, { type });
      invalidateAll();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi cập nhật loại media");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-surface-muted/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <UploadSimple size={32} weight="duotone" className="text-primary" />
        {uploading ? (
          <p className="text-sm text-foreground-muted">Đang upload...</p>
        ) : isDragActive ? (
          <p className="text-sm font-medium text-primary">Thả file vào đây...</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              Kéo thả file hoặc click để chọn
            </p>
            <p className="text-xs text-foreground-muted">
              Hỗ trợ: JPG, PNG, WebP, GIF, MP4, PDF — Tối đa 50MB/file
            </p>
          </>
        )}
      </div>

      {/* Media Grid */}
      {sortedMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <ImageIcon size={32} weight="duotone" className="text-foreground-muted" />
          <p className="text-sm text-foreground-muted">Chưa có media nào. Hãy upload ảnh/video cho dự án.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedMedia.map((item, index) => {
            const url = getMediaUrl(item);
            const isImg = isImageType(item);
            const TypeIcon = mediaTypeIcons[item.type] || ImageIcon;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface"
              >
                {/* Preview */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  {url && isImg ? (
                    <img
                      src={url}
                      alt={item.caption || ""}
                      className="h-full w-full object-cover"
                    />
                  ) : url && item.type === "VIDEO" ? (
                    <video
                      src={url}
                      className="h-full w-full object-cover"
                      controls
                      muted
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-foreground-muted">
                      <TypeIcon size={32} weight="duotone" />
                      <span className="text-xs">{mediaTypeLabels[item.type]}</span>
                    </div>
                  )}

                  {/* Primary badge */}
                  {item.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="gap-1">
                        <Star size={10} weight="fill" />
                        Ảnh chính
                      </Badge>
                    </div>
                  )}

                  {/* Type badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {mediaTypeLabels[item.type]}
                    </Badge>
                  </div>

                  {/* Action overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    {!item.isPrimary && isImg && (
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => handleSetPrimary(item.id)}
                        title="Đặt làm ảnh chính"
                      >
                        <Star size={14} />
                      </Button>
                    )}
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      onClick={() => handleStartEditCaption(item)}
                      title="Sửa chú thích"
                    >
                      <PencilSimple size={14} />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                      title="Xóa"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>

                {/* Caption + Controls */}
                <div className="flex flex-col gap-2 p-3">
                  {editingCaptionId === item.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={captionValue}
                        onChange={(e) => setCaptionValue(e.target.value)}
                        placeholder="Nhập chú thích..."
                        className="h-7 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveCaption(item.id);
                          if (e.key === "Escape") handleCancelEditCaption();
                        }}
                      />
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => handleSaveCaption(item.id)}
                      >
                        <Check size={12} />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={handleCancelEditCaption}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <p className="line-clamp-1 text-xs text-foreground-muted">
                      {item.caption || "Không có chú thích"}
                    </p>
                  )}

                  {/* Type selector + Reorder */}
                  <div className="flex items-center justify-between">
                    <select
                      value={item.type}
                      onChange={(e) => handleUpdateType(item.id, e.target.value as MediaType)}
                      className="h-7 rounded-md border border-border bg-surface px-2 text-xs text-foreground"
                    >
                      {(Object.keys(mediaTypeLabels) as MediaType[]).map((t) => (
                        <option key={t} value={t}>
                          {mediaTypeLabels[t]}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={index === 0}
                        onClick={() => handleMove(index, "left")}
                        title="Di chuyển trái"
                      >
                        <CaretLeft size={14} />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={index === sortedMedia.length - 1}
                        onClick={() => handleMove(index, "right")}
                        title="Di chuyển phải"
                      >
                        <CaretRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
