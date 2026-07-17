"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadSimple, FileText, Image as ImageIcon, Video } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  visibility: string;
}

const mockFiles: UploadedFile[] = [
  { id: "1", name: "vinhomes-central-park.jpg", size: 2400000, type: "image/jpeg", visibility: "PUBLIC" },
  { id: "2", name: "masteri-thao-dien.png", size: 3100000, type: "image/png", visibility: "TENANT" },
  { id: "3", name: "hop-dong-dat-coc.pdf", size: 1200000, type: "application/pdf", visibility: "SENSITIVE" },
  { id: "4", name: "video-tour.mp4", size: 45000000, type: "video/mp4", visibility: "ASSIGNED" },
];

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type === "application/pdf") return FileText;
  return FileText;
}

function formatSize(bytes: number): string {
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${bytes} B`;
}

const visibilityVariant: Record<string, "green" | "blue" | "yellow" | "red" | "default"> = {
  PUBLIC: "green",
  TENANT: "blue",
  ASSIGNED: "yellow",
  PRIVATE: "default",
  SENSITIVE: "red",
};

export default function FilesPage() {
  const [files] = useState(mockFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Uploaded files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 52428800,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
      "video/mp4": [".mp4"],
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Tap tin" title="Quan ly tap tin" description="Upload va quan ly tap tin, hinh anh, tai lieu" />

      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-10 px-4 transition-colors ${
          isDragActive ? "border-border-strong bg-surface-muted/50" : "border-border bg-surface"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex size-12 items-center justify-center rounded-lg bg-surface-muted">
          <UploadSimple size={24} className="text-foreground-muted" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">{isDragActive ? "Tha file vao day" : "Keo tha file hoac click de chon"}</p>
          <p className="mt-1 text-xs text-foreground-muted">Toi da 10 file, 50MB/file - JPG, PNG, WebP, GIF, PDF, MP4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {files.map((file) => {
          const Icon = getFileIcon(file.type);
          return (
            <div key={file.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                <Icon size={20} className="text-foreground-muted" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="truncate text-sm font-medium">{file.name}</span>
                <span className="text-xs text-foreground-muted tabular-nums">{formatSize(file.size)}</span>
              </div>
              <Badge variant={visibilityVariant[file.visibility] ?? "default"} className="shrink-0 hidden sm:inline-flex">{file.visibility}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
