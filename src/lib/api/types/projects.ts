export interface GetProjectsResponse {
  items: Project[];
  total: number;
  limit: number;
  offset: number;
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
  _count: { properties: number };
}
