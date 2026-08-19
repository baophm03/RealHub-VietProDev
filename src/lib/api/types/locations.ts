export interface GetLocationsMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export interface GetLocationsResponse {
  success: boolean;
  data: Location[];
  meta: GetLocationsMeta;
  timestamp: string;
}

export interface Location {
  id: string;
  parentId: string | null;
  type: string;
  name: string;
  code: string;
  slug: string | null;
  fullPath: string | null;
  level: number;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: { children: number };
}
