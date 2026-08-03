export interface GetProjectsResponse {
  data: Project[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetProjectItemResponse {
  data: Project;
}

export interface ProjectMedia {
  id: string;
  type: string;
  sortOrder: number;
  isPrimary: boolean;
  caption: string | null;
  fileId: string;
  file: {
    id: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    visibility: string;
    bucket: string;
    objectKey: string;
    url: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  developer: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  province: { id: string; name: string; code: string } | null;
  district: { id: string; name: string; code: string } | null;
  properties: {
    id: string;
    propertyCode: string;
    title: string;
    businessStatus: string;
    publicationStatus: string;
  }[];
  media: ProjectMedia[];
  _count: {
    properties: number;
  };
}
