"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import {
  Files as FilesIcon,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ImageLightbox, type LightboxImage } from "@/components/shared/image-lightbox";
import { FileCard, visibilityLabel, visibilityOptions } from "./_components/file-card";
import { ability } from "@/config/casl/ability";
import {
  useGetApiFilesAdmin,
  getGetApiFilesAdminQueryKey,
  usePostApiFileUpload,
  useDeleteApiFile,
  getApiFileDownloadUrl,
} from "@/lib/api/endpoints/files";
import type { FileItem } from "@/lib/api/types/files";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const params = useMemo(
    () => (visibilityFilter ? { visibility: visibilityFilter as any } : undefined),
    [visibilityFilter],
  );

  const { data: filesData, isLoading } = useGetApiFilesAdmin(params);
  const files = useMemo(() => {
    const raw = filesData as any;
    return (raw?.data ?? []) as FileItem[];
  }, [filesData]);

  const { mutateAsync: uploadFile } = usePostApiFileUpload();
  const { mutateAsync: deleteFile } = useDeleteApiFile();

  const invalidateFiles = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetApiFilesAdminQueryKey() });
  }, [queryClient]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          await uploadFile({
            data: {
              file,
              visibility: "TENANT",
            },
          });
        }
        invalidateFiles();
        toast.success(`Đã upload ${acceptedFiles.length} file thành công`);
      } catch (err) {
        console.error(err);
        toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi upload file");
      } finally {
        setUploading(false);
      }
    },
    [uploadFile, invalidateFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
      "video/mp4": [".mp4"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "application/zip": [".zip"],
    },
    disabled: uploading || !ability.can("CREATE", "FILE"),
  });

  const filtered = useMemo(() => {
    return files.filter((f) =>
      f.original?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [files, search]);

  const lightboxImages = useMemo<LightboxImage[]>(
    () => filtered.filter((f) => f.mimeType.startsWith("image/") && f.url).map((f) => ({ url: f.url!, name: f.original })),
    [filtered],
  );

  const openLightbox = (file: FileItem) => {
    const idx = lightboxImages.findIndex((img) => img.url === file.url);
    if (idx >= 0) {
      setPreviewIndex(idx);
      setLightboxOpen(true);
    }
  };

  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Xóa file "${file.original}"?`)) return;
    try {
      await deleteFile({ id: file.id });
      invalidateFiles();
      toast.success("Đã xóa file");
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi khi xóa file");
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const res = await getApiFileDownloadUrl(file.id);
      const url = (res as any)?.url;
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("Không lấy được URL download");
      }
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi khi lấy URL download");
    }
  };

  const canWrite = ability.can("CREATE", "FILE");
  const canDelete = ability.can("DELETE_OWN", "FILE");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Tập tin"
        title="Quản lý tập tin"
        description="Upload và quản lý tập tin, hình ảnh, tài liệu"
      />

      {/* Upload Zone */}
      {canWrite ? (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-10 px-4 transition-colors ${isDragActive ? "border-border-strong bg-surface-muted/50" : "border-border bg-surface"
            } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex size-12 items-center justify-center rounded-lg bg-surface-muted">
            <Upload size={24} className="text-foreground-muted" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {uploading ? "Đang upload..." : isDragActive ? "Thả file vào đây" : "Kéo thả file hoặc click để chọn"}
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              Tối đa 10 file, 50MB/file — JPG, PNG, WebP, GIF, PDF, MP4, DOCX, XLSX
            </p>
          </div>
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto min-w-0"
          />
          <Select
            value={visibilityFilter}
            onValueChange={(value) => setVisibilityFilter(!value || value === "ALL" ? "" : value)}
            items={visibilityFilter ? [{ value: visibilityFilter, label: visibilityLabel[visibilityFilter] }] : []}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" label="Tất cả">Tất cả</SelectItem>
              {visibilityOptions.map((v) => (
                <SelectItem key={v} value={v} label={visibilityLabel[v]}>
                  {visibilityLabel[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-foreground-muted tabular-nums">
          {filtered.length} file
        </span>
      </div>

      {/* File Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FilesIcon size={24} />}
          title="Chưa có tập tin nào"
          description={search || visibilityFilter ? "Không tìm thấy file phù hợp với bộ lọc" : "Upload file đầu tiên để bắt đầu"}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              canDelete={canDelete}
              onPreview={openLightbox}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={lightboxImages}
        index={previewIndex ?? 0}
        onIndexChange={setPreviewIndex}
      />
    </div>
  );
}
