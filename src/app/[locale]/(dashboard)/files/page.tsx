"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import {
  UploadSimple,
  FileText,
  Image as ImageIcon,
  Video,
  Trash,
  Download,
  Eye,
  Lock,
  Funnel,
  Files as FilesIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserStore } from "@/lib/stores/user-store";
import { customInstance } from "@/lib/api/mutator/custom-instance";
import {
  useGetApiFiles,
  getGetApiFilesQueryKey,
  usePostApiFileUpload,
  useDeleteApiFile,
  useGetApiFileDownloadUrl,
} from "@/lib/api/endpoints/files";
import type {
  FileItem,
  GetFilesResponse,
  FileVisibility,
} from "@/lib/api/types/files";

const visibilityVariant: Record<string, "green" | "blue" | "yellow" | "red" | "default"> = {
  PUBLIC: "green",
  TENANT: "blue",
  ASSIGNED: "yellow",
  PRIVATE: "default",
  SENSITIVE: "red",
};

const visibilityLabel: Record<string, string> = {
  PUBLIC: "Công khai",
  TENANT: "Tenant",
  ASSIGNED: "Gán cho",
  PRIVATE: "Riêng tư",
  SENSITIVE: "Nhạy cảm",
};

const visibilityOptions: FileVisibility[] = [
  "PUBLIC",
  "TENANT",
  "ASSIGNED",
  "PRIVATE",
  "SENSITIVE",
];

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type === "application/pdf") return FileText;
  return FileText;
}

function formatSize(bytes: number): string {
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function FilesPage() {
  const queryClient = useQueryClient();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const params = useMemo(
    () => (visibilityFilter ? { visibility: visibilityFilter as any } : undefined),
    [visibilityFilter],
  );

  const { data: filesData, isLoading } = useGetApiFiles(params);
  const files = useMemo(() => {
    const raw = filesData as any;
    if (Array.isArray(raw)) return raw as FileItem[];
    if (Array.isArray(raw?.data)) return raw.data as FileItem[];
    if (Array.isArray(raw?.data?.data)) return raw.data.data as FileItem[];
    if (Array.isArray(raw?.items)) return raw.items as FileItem[];
    return [];
  }, [filesData]);

  const { mutateAsync: uploadFile } = usePostApiFileUpload();
  const { mutateAsync: deleteFile } = useDeleteApiFile();

  const invalidateFiles = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetApiFilesQueryKey() });
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
        toast.error("Có lỗi xảy ra khi upload file");
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
    disabled: uploading || (mounted && !hasPermission("files:write")),
  });

  const filtered = useMemo(() => {
    return files.filter((f) =>
      f.originalFileName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [files, search]);

  const handleDelete = async (file: FileItem) => {
    if (!confirm(`Xóa file "${file.originalFileName}"?`)) return;
    try {
      await deleteFile({ id: file.id });
      invalidateFiles();
      toast.success("Đã xóa file");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi xóa file");
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const res = await customInstance<{ url: string }>({
        url: `/api/files/${file.id}/download`,
        method: "GET",
      });
      const url = (res as any)?.url;
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("Không lấy được URL download");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi lấy URL download");
    }
  };

  const handleUpdateVisibility = async (file: FileItem, visibility: string) => {
    try {
      await customInstance({
        url: `/api/files/${file.id}/visibility`,
        method: "PATCH",
        data: { visibility },
      });
      invalidateFiles();
      toast.success("Đã cập nhật visibility");
      setMenuOpenId(null);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi khi cập nhật visibility");
    }
  };

  const canWrite = mounted && hasPermission("files:write");
  const canDelete = mounted && hasPermission("files:delete");

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
            <UploadSimple size={24} className="text-foreground-muted" />
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
            placeholder="Tìm kiếm theo tên file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto min-w-0"
          />
          <div className="relative">
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="h-9 appearance-none rounded-md border border-border bg-surface pl-9 pr-8 text-sm text-foreground"
            >
              <option value="">Tất cả visibility</option>
              {visibilityOptions.map((v) => (
                <option key={v} value={v}>
                  {visibilityLabel[v]}
                </option>
              ))}
            </select>
            <Funnel
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
          </div>
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
          {filtered.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            const isImage = file.mimeType.startsWith("image/");
            return (
              <div
                key={file.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                {/* Preview */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  {isImage && file.url ? (
                    <img
                      src={file.url}
                      alt={file.originalFileName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-foreground-muted">
                      <Icon size={32} weight="duotone" />
                      <span className="text-xs uppercase">{file.mimeType.split("/").pop()}</span>
                    </div>
                  )}

                  {/* Visibility badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant={visibilityVariant[file.visibility] ?? "default"} className="text-[10px]">
                      {file.isSensitive && <Lock size={10} weight="fill" />}
                      {visibilityLabel[file.visibility] ?? file.visibility}
                    </Badge>
                  </div>

                  {/* Action overlay */}
                  {(canWrite || canDelete) && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => handleDownload(file)}
                        title="Tải xuống"
                      >
                        <Download size={14} />
                      </Button>
                      {canWrite && (
                        <Button
                          size="icon-sm"
                          variant="secondary"
                          onClick={() => setMenuOpenId(menuOpenId === file.id ? null : file.id)}
                          title="Đổi visibility"
                        >
                          <Eye size={14} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => handleDelete(file)}
                          title="Xóa"
                        >
                          <Trash size={14} />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Visibility menu */}
                  {menuOpenId === file.id && (
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 rounded-md border border-border bg-surface p-1 shadow-lg">
                      {visibilityOptions.map((v) => (
                        <button
                          key={v}
                          onClick={() => handleUpdateVisibility(file, v)}
                          className={`rounded px-2 py-1 text-left text-xs hover:bg-surface-muted ${file.visibility === v ? "font-semibold text-primary" : "text-foreground"
                            }`}
                        >
                          {visibilityLabel[v]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-0.5 p-3">
                  <span className="truncate text-sm font-medium" title={file.originalFileName}>
                    {file.originalFileName}
                  </span>
                  <div className="flex items-center justify-between text-xs text-foreground-muted tabular-nums">
                    <span>{formatSize(Number(file.fileSize || 0))}</span>
                    <span>{formatDate(file.createdAt)}</span>
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
