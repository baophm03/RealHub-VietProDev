export interface GetProjectsMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export interface GetProjectsResponse {
  success: boolean;
  data: Project[];
  meta: GetProjectsMeta;
  timestamp: string;
}

export interface GetProjectItemResponse {
  success: boolean;
  data: Project;
  timestamp: string;
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
    original: string;
    mimeType: string;
    fileSize: number;
    visibility: string;
    bucket: string;
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
  properties: ProjectProperty[];
  media: ProjectMedia[];
  _count: {
    properties: number;
  };
}

export interface ProjectProperty {
  id: string;
  propertyCode: string;
  title: string;
  description: string | null;
  slug: string | null;
  transactionType: string | null;
  sellingMode: string | null;
  visibilityScope: string | null;
  price: number | null;
  priceUnit: string | null;
  area: number | null;
  areaUnit: string | null;
  addressPublic: string | null;
  verificationStatus: string | null;
  publicationStatus: string | null;
  businessStatus: string | null;
  dynamicValuesJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  propertyType: { id: string; name: string; code: string; group: string | null } | null;
  province: { id: string; name: string; code: string } | null;
  district: { id: string; name: string; code: string } | null;
  ward: { id: string; name: string; code: string } | null;
  media: {
    id: string;
    fileId: string;
    file: { id: string; url: string; original: string } | null;
  }[];
}
