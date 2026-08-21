"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Image as ImageIcon,
  Layers,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { usePostApiFileUpload } from "@/lib/api/endpoints/files";
import type { NewsThumbnail } from "@/lib/api/types/news";
import { Button } from "@/components/ui/button";
import { FilePickerModal } from "@/components/shared/file-picker-modal";

interface ThumbnailUploaderProps {
  fileId?: string | null;
  thumbnail?: NewsThumbnail | null;
  onChange: (fileId: string | null) => void;
}

export function ThumbnailUploader({ fileId, thumbnail, onChange }: ThumbnailUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { mutateAsync: uploadFile } = usePostApiFileUpload();

  const previewUrl = localPreview ?? thumbnail?.url ?? null;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setUploading(true);
      setLocalPreview(URL.createObjectURL(file));
      try {
        const result: any = await uploadFile({
          data: { file, ownerType: "NEWS", visibility: "TENANT" },
        });
        const newId = result?.id || result?.data?.id;
        if (!newId) throw new Error("Upload không trả về file id");
        onChange(newId);
        toast.success("Đã tải lên ảnh thumbnail");
      } catch (err) {
        toast.error((err as any)?.response?.data?.error?.message?.[0] || "Tải lên ảnh thất bại");
        console.error(err);
        setLocalPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [uploadFile, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    multiple: false,
    disabled: uploading,
  });

  const handleRemove = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onChange(null);
  };

  const handlePick = (files: { id: string; url?: string; original?: string }[]) => {
    const picked = files[0];
    if (!picked) return;
    setLocalPreview(picked.url ?? null);
    onChange(picked.id);
    toast.success("Đã chọn ảnh từ thư viện");
  };

  return (
    <div className="flex flex-col gap-2">
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          <div className="relative aspect-video bg-surface-muted">
            <img
              src={previewUrl}
              alt={thumbnail?.original ?? "Thumbnail"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <ImageIcon size={14} />
              <span className="line-clamp-1">
                {thumbnail?.original ?? "Ảnh đã tải lên"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPickerOpen(true)}
              >
                <Layers size={14} />
                Đổi ảnh
              </Button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-md p-1 text-foreground-muted transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Xóa thumbnail"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "hover:bg-surface-muted/30"
              } ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin text-primary" />
                <p className="text-xs text-foreground-muted">Đang tải lên...</p>
              </>
            ) : (
              <>
                <Upload size={20} className="text-foreground-muted" />
                <p className="text-xs text-foreground-muted">
                  Kéo thả hoặc click để chọn ảnh thumbnail
                </p>
              </>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            <Layers size={14} />
            Chọn từ thư viện
          </Button>
        </div>
      )}

      <FilePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handlePick}
        multiple={false}
        filter="image"
        ownerType="NEWS"
        excludeIds={fileId ? [fileId] : []}
        title="Chọn ảnh thumbnail"
      />
    </div>
  );
}
