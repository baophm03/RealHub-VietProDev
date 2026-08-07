export interface NewsCategory {
  id: string;
  name: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; fullName: string } | null;
  updater?: { id: string; fullName: string } | null;
  _count?: { news: number };
}

export interface NewsThumbnail {
  id: string;
  mimeType?: string;
  original?: string;
  fileSize?: number;
  url?: string;
}

export interface News {
  id: string;
  thumbnailId?: string | null;
  title: string;
  description?: string | null;
  content?: string | null;
  categoryNewsId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  thumbnail?: NewsThumbnail | null;
  category?: { id: string; name: string; description?: string | null } | null;
  creator?: { id: string; fullName: string } | null;
  updater?: { id: string; fullName: string } | null;
}

export interface GetNewsResponse {
  success: boolean;
  data: News[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
  timestamp: string;
  statusCode?: number;
}

export interface GetNewsCategoriesResponse {
  success: boolean;
  data: NewsCategory[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
  timestamp: string;
  statusCode?: number;
}

export interface GetNewsItemResponse {
  success: boolean;
  data: News;
  timestamp: string;
  statusCode?: number;
}

export interface GetNewsCategoryItemResponse {
  success: boolean;
  data: NewsCategory;
  timestamp: string;
  statusCode?: number;
}
