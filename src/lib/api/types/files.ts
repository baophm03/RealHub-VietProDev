export interface FileItem {
  id: string;
  url: string;
  objectKey: string;
  bucket: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  visibility: string;
  isSensitive: boolean;
  ownerType: string | null;
  ownerId: string | null;
  createdAt: string;
}

export interface GetFilesResponse {
  data: FileItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface UploadFileResponse {
  id: string;
  url: string;
  objectKey: string;
  originalFileName: string;
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
