export interface FileItem {
  id: string;
  url: string;
  original: string;
  bucket: string;
  mimeType: string;
  fileSize: number;
  visibility: string;
  isSensitive: boolean;
  ownerType: string | null;
  ownerId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetFilesMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export interface GetFilesResponse {
  success: boolean;
  data: FileItem[];
  meta: GetFilesMeta;
  timestamp: string;
}

export interface UploadFileResponse {
  id: string;
  url: string;
  original: string;
  mimeType: string;
  fileSize: number;
  visibility: string;
}

export interface DownloadUrlResponse {
  url: string;
  fileName: string;
  mimeType: string;
}

export const FILE_VISIBILITY = {
  PUBLIC: "PUBLIC",
  TENANT: "TENANT",
  ASSIGNED: "ASSIGNED",
  PRIVATE: "PRIVATE",
  SENSITIVE: "SENSITIVE",
} as const;

export type FileVisibility = (typeof FILE_VISIBILITY)[keyof typeof FILE_VISIBILITY];
