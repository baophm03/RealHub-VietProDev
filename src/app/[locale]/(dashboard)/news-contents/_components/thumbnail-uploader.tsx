"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadSimple, Spinner, X, Image as ImageIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { usePostApiFileUpload } from "@/lib/api/endpoints/files";

interface ThumbnailUploaderProps {
  fileId?: string | null;
  onChange: (fileId: string | null) => void;
}

export function ThumbnailUploader({ fileId, onChange }: ThumbnailUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const { mutateAsync: uploadFile } = usePostApiFileUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setUploading(true);
      setPreviewName(file.name);
      try {
        const result: any = await uploadFile({
          data: { file, ownerType: "NEWS", visibility: "TENANT" },
        });
        const newId = result?.id || result?.data?.id;
        if (!newId) throw new Error("Upload không trả về file id");
        onChange(newId);
        toast.success("Đã tải lên ảnh thumbnail");
      } catch (err) {
        toast.error("Tải lên ảnh thất bại");
        console.error(err);
        setPreviewName(null);
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

  return (
    <div className="flex flex-col gap-2">
      {fileId ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted/30 px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <ImageIcon size={16} />
            <span className="font-mono text-xs">{fileId.slice(0, 8)}…</span>
            {previewName && <span className="text-xs">({previewName})</span>}
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setPreviewName(null);
            }}
            className="rounded-md p-1 text-foreground-muted hover:bg-red-50 hover:text-red-600"
            aria-label="Xóa thumbnail"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-center transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "hover:bg-surface-muted/30"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <Spinner size={20} className="animate-spin text-primary" />
              <p className="text-xs text-foreground-muted">Đang tải lên...</p>
            </>
          ) : (
            <>
              <UploadSimple size={20} className="text-foreground-muted" />
              <p className="text-xs text-foreground-muted">
                Kéo thả hoặc click để chọn ảnh thumbnail
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
