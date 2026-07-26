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
