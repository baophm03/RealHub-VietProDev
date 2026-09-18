export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  offset: number;
  hasMore?: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
