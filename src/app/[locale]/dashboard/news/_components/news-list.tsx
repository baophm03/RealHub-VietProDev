"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Newspaper, Trash, PencilSimple, Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserStore } from "@/lib/stores/user-store";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useGetApiNews,
  useDeleteApiNews,
} from "@/lib/api/endpoints/news";
import type { GetNewsResponse, News } from "@/lib/api/types/news";

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

export function NewsList() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: newsData, isLoading, refetch: refetchNews } = useGetApiNews({ limit: "100" });
  const news: News[] = (newsData as unknown as GetNewsResponse)?.data ?? [];

  const { mutateAsync: deleteNews } = useDeleteApiNews();

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bài viết này? Hành động không thể hoàn tác.")) return;
    setDeletingId(id);
    try {
      await deleteNews({ id });
      await refetchNews();
      toast.success("Đã xóa bài viết");
    } catch (err) {
      toast.error("Không thể xóa bài viết");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<News>[] = [
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Chuyên mục",
      cell: ({ row }) =>
        row.original.category ? (
          <Badge variant="default">{row.original.category.name}</Badge>
        ) : (
          <span className="text-xs text-foreground-muted">—</span>
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
              router.push(`/dashboard/news/${row.original.id}`);
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
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto min-w-0"
        />
        {mounted && hasPermission("news:write") && (
          <Button onClick={() => router.push("/dashboard/news/new")}>
            <Plus size={16} />
            Thêm bài viết
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
          onRowClick={(row) => router.push(`/dashboard/news/${row.id}`)}
          emptyMessage="Không tìm thấy bài viết nào"
        />
      ) : (
        <EmptyState
          icon={<Newspaper size={24} />}
          title="Chưa có bài viết"
          description="Tạo bài viết đầu tiên để hiển thị trên trang tin tức"
          action={
            mounted && hasPermission("news:write") && (
              <Button onClick={() => router.push("/dashboard/news/new")}>
                <Plus size={16} />
                Thêm bài viết
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
