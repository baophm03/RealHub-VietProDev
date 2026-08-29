export interface NewsCategory {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; fullName: string; avatarUrl: string | null } | null;
  updater?: { id: string; fullName: string; avatarUrl: string | null } | null;
  _count?: { news: number };
}

export interface NewsThumbnail {
  id: string;
  mimeType?: string;
  original?: string;
  fileSize?: number;
  url?: string;
}

export interface NewsCreator {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role?: { id: string; code: string; name: string } | null;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  thumbnail?: NewsThumbnail | null;
  category?: { id: string; code: string; name: string; description?: string | null } | null;
  creator?: NewsCreator | null;
  updater?: { id: string; fullName: string; avatarUrl: string | null } | null;
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

export interface GetNewsByCategoryCodeResponse {
  success: boolean;
  data: {
    category: { id: string; code: string; name: string; description?: string | null };
    items: News[];
    total: number;
    limit: number;
    offset: number;
  };
  timestamp: string;
  statusCode?: number;
}
