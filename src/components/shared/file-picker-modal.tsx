"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  FileText,
  Image as ImageIcon,
  Loader2,
  Search,
  Upload,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useGetApiFiles,
  getGetApiFilesQueryKey,
  usePostApiFileUpload,
} from "@/lib/api/endpoints/files";
import type { FileItem } from "@/lib/api/types/files";

export interface FilePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (files: FileItem[]) => void;
  /** Allow selecting multiple files (default: false) */
  multiple?: boolean;
  /** Filter shown files by mime type group (default: "image") */
  filter?: "image" | "all";
  /** ownerType/ownerId to tag newly uploaded files */
  ownerType?: string;
  ownerId?: string;
  /** File ids to exclude from the list (e.g. already attached) */
  excludeIds?: string[];
  title?: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return Video;
  return FileText;
}

function formatSize(bytes: number): string {
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function FilePickerModal({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  filter = "image",
  ownerType,
  ownerId,
  excludeIds = [],
  title,
}: FilePickerModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [uploading, setUploading] = useState(false);

  // Reset selection when modal closes
  useEffect(() => {
    if (!open) {
      setSelected(new Set());
      setSearch("");
      setTab("library");
    }
  }, [open]);

  const { data: filesData, isLoading } = useGetApiFiles(undefined);
  const allFiles = useMemo(() => {
    const raw = filesData as any;
    return (raw?.data ?? []) as FileItem[];
  }, [filesData]);

  const files = useMemo(() => {
    let list = allFiles;
    if (filter === "image") {
      list = list.filter((f) => f.mimeType?.startsWith("image/"));
    }
    if (excludeIds.length > 0) {
      const set = new Set(excludeIds);
      list = list.filter((f) => !set.has(f.id));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.original?.toLowerCase().includes(q));
    }
    return list;
  }, [allFiles, filter, excludeIds, search]);

  const { mutateAsync: uploadFile } = usePostApiFileUpload();

  const invalidateFiles = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetApiFilesQueryKey() });
  }, [queryClient]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);
      const uploadedIds: string[] = [];
      try {
        for (const file of acceptedFiles) {
          const result: any = await uploadFile({
            data: {
              file,
              ownerType: ownerType as any,
              ownerId,
              visibility: "TENANT",
            },
          });
          const newId = result?.id || result?.data?.id;
          if (newId) uploadedIds.push(newId);
        }
        invalidateFiles();
        toast.success(`Đã upload ${acceptedFiles.length} file`);
        // Auto-select newly uploaded files
        setSelected((prev) => {
          const next = new Set(prev);
          for (const id of uploadedIds) next.add(id);
          return next;
        });
        // Switch back to library tab so user sees the result
        setTab("library");
      } catch (err) {
        console.error(err);
        toast.error("Có lỗi xảy ra khi upload file");
      } finally {
        setUploading(false);
      }
    },
    [uploadFile, ownerType, ownerId, invalidateFiles],
  );

  const acceptConfig: Record<string, string[]> =
    filter === "image"
      ? {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
      }
      : {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
        "video/mp4": [".mp4"],
        "application/pdf": [".pdf"],
      };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxSize: 50 * 1024 * 1024,
    disabled: uploading,
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (!multiple) {
        return prev.has(id) ? new Set() : new Set([id]);
      }
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedFiles = files.filter((f) => selected.has(f.id));
    // Also include newly uploaded files that may not be in `files` yet (filtered out by search/etc)
    const selectedFromAll = allFiles.filter((f) => selected.has(f.id));
    const merged = [...selectedFiles, ...selectedFromAll];
    // Dedupe by id
    const seen = new Set<string>();
    const result = merged.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
    if (result.length === 0) return;
    onSelect(result);
    onOpenChange(false);
  };

  const selectedCount = selected.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle>{title ?? (multiple ? "Chọn tập tin" : "Chọn tập tin")}</DialogTitle>
          <DialogDescription>
            {filter === "image"
              ? "Chọn ảnh từ thư viện hệ thống hoặc tải lên mới"
              : "Chọn file từ thư viện hệ thống hoặc tải lên mới"}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-4 pt-3">
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`relative px-3 py-2 text-sm font-medium transition-colors ${tab === "library" ? "text-foreground" : "text-foreground-muted hover:text-foreground"}`}
          >
            Thư viện
            {tab === "library" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`relative px-3 py-2 text-sm font-medium transition-colors ${tab === "upload" ? "text-foreground" : "text-foreground-muted hover:text-foreground"}`}
          >
            Tải lên mới
            {tab === "upload" && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "library" ? (
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-muted"
                />
                <Input
                  type="search"
                  placeholder="Tìm theo tên file..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-lg bg-surface-muted" />
                  ))}
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
                  <ImageIcon size={32} className="text-foreground-muted" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {search ? "Không tìm thấy file phù hợp" : "Chưa có file nào trong thư viện"}
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      {search
                        ? "Thử từ khóa khác hoặc tải lên file mới"
                        : "Chuyển sang tab “Tải lên mới” để thêm file"}
                    </p>
                  </div>
                  {!search && (
                    <Button variant="outline" size="sm" onClick={() => setTab("upload")}>
                      <Upload size={14} />
                      Tải lên mới
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {files.map((file) => {
                    const isImage = file.mimeType?.startsWith("image/");
                    const Icon = getFileIcon(file.mimeType);
                    const isSelected = selected.has(file.id);
                    return (
                      <button
                        type="button"
                        key={file.id}
                        onClick={() => toggleSelect(file.id)}
                        className={`group relative flex aspect-square flex-col overflow-hidden rounded-lg border-2 bg-surface-muted text-left transition-all ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-border-strong"}`}
                      >
                        {isImage && file.url ? (
                          <img
                            src={file.url}
                            alt={file.original}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-foreground-muted">
                            <Icon size={28} />
                            <span className="text-[10px] uppercase">
                              {file.mimeType?.split("/").pop()}
                            </span>
                          </div>
                        )}

                        {/* Overlay gradient for legibility */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                          <p className="line-clamp-1 text-[11px] font-medium text-white">
                            {file.original}
                          </p>
                          <p className="text-[10px] text-white/70 tabular-nums">
                            {formatSize(Number(file.fileSize || 0))}
                          </p>
                        </div>

                        {/* Selection indicator */}
                        <div
                          className={`absolute top-2 right-2 flex size-5 items-center justify-center rounded-full border-2 transition-all ${isSelected ? "border-primary bg-primary text-white" : "border-white/80 bg-black/30 text-transparent group-hover:border-white"}`}
                        >
                          <Check size={12} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div
                {...getRootProps()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface-muted/50"} ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <>
                    <Loader2 size={28} className="animate-spin text-primary" />
                    <p className="text-sm text-foreground-muted">Đang tải lên...</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isDragActive ? "Thả file vào đây" : "Kéo thả file hoặc click để chọn"}
                      </p>
                      <p className="mt-1 text-xs text-foreground-muted">
                        {filter === "image"
                          ? "JPG, PNG, WebP, GIF — Tối đa 50MB/file"
                          : "JPG, PNG, WebP, GIF, MP4, PDF — Tối đa 50MB/file"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-center text-xs text-foreground-muted">
                File tải lên sẽ được tự động chọn và thêm vào thư viện
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-border p-3">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            {selectedCount > 0 ? (
              <>
                <Badge variant="default" className="tabular-nums">
                  {selectedCount} đã chọn
                </Badge>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <X size={12} />
                  Bỏ chọn
                </button>
              </>
            ) : (
              <span>Chưa chọn file nào</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={selectedCount === 0}>
              {selectedCount > 0 ? `Chọn ${selectedCount} file` : "Chọn file"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
