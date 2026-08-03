"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, Trash, PencilSimple, Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserStore } from "@/lib/stores/user-store";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useGetApiNewsCategories,
  useDeleteApiNewsCategory,
} from "@/lib/api/endpoints/news-categories";
import type { GetNewsCategoriesResponse, NewsCategory } from "@/lib/api/types/news";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function NewsCategoriesList() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categoriesData, isLoading, refetch: refetchCategories } = useGetApiNewsCategories({ limit: "100" });
  const categories: NewsCategory[] =
    (categoriesData as unknown as GetNewsCategoriesResponse)?.data ?? [];

  const { mutateAsync: deleteCategory } = useDeleteApiNewsCategory();

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa chuyên mục này? Các bài viết thuộc chuyên mục sẽ mất chuyên mục.")) return;
    setDeletingId(id);
    try {
      await deleteCategory({ id });
      await refetchCategories();
      toast.success("Đã xóa chuyên mục");
    } catch (err) {
      toast.error("Không thể xóa chuyên mục");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<NewsCategory>[] = [
    {
      accessorKey: "name",
      header: "Tên chuyên mục",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[400px] text-sm text-foreground-muted">
          {row.original.description ?? "—"}
        </span>
      ),
    },
    {
      id: "count",
      header: "Số bài viết",
      cell: ({ row }) => (
        <Badge variant="default">{row.original._count?.news ?? 0}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/news-contents/categories/${row.original.id}/edit`);
            }}
            className="rounded-md p-1.5 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label="Sửa"
          >
            <PencilSimple size={16} />
          </button>
          {mounted && hasPermission("news:delete") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              disabled={deletingId === row.original.id}
              className="rounded-md p-1.5 text-foreground-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Xóa"
            >
              {deletingId === row.original.id ? (
                <Spinner size={16} className="animate-spin" />
              ) : (
                <Trash size={16} />
              )}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Tìm kiếm chuyên mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto min-w-0"
        />
        {mounted && hasPermission("news:write") && (
          <Button onClick={() => router.push("/news-contents/categories/new")}>
            <Plus size={16} />
            Thêm chuyên mục
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Spinner size={24} className="animate-spin text-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => router.push(`/news-contents/categories/${row.id}/edit`)}
          emptyMessage="Không tìm thấy chuyên mục nào"
        />
      ) : (
        <EmptyState
          icon={<Tag size={24} />}
          title="Chưa có chuyên mục"
          description="Tạo chuyên mục đầu tiên để phân loại bài viết"
          action={
            mounted && hasPermission("news:write") && (
              <Button onClick={() => router.push("/news-contents/categories/new")}>
                <Plus size={16} />
                Thêm chuyên mục
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
