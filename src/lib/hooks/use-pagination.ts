"use client";

import { useState } from "react";

export interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  limit: string;
  offset: string;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function usePagination(initialPageSize = 10): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const offset = String((currentPage - 1) * pageSize);
  const limit = String(pageSize);

  return {
    currentPage,
    pageSize,
    limit,
    offset,
    setCurrentPage,
    setPageSize,
  };
}
