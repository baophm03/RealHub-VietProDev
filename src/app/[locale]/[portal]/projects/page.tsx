"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { Building2, Filter, Plus, Trash2 } from "lucide-react";
import { Can } from "@casl/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetApiProjects } from "@/lib/api/endpoints/projects";
import { Project } from "@/lib/api/types/projects";
import { usePagination } from "@/lib/hooks/use-pagination";
import { DeleteProjectDialog } from "./_components/delete-project-dialog";

const statusVariant: Record<string, "green" | "default"> = {
  ACTIVE: "green",
  INACTIVE: "default",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

export default function ProjectsPage() {
  const router = useRouter();
  const portalPath = usePortalPath();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const pagination = usePagination(10);

  const { data: projectsData, refetch } = useGetApiProjects({
    search: search.trim() || undefined,
    limit: pagination.limit,
    offset: pagination.offset,
  });
  const projects = useMemo(() => {
    const raw = projectsData as any;
    return (raw?.data ?? []) as Project[];
  }, [projectsData]);
  const meta = (projectsData as any)?.meta;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil((meta?.total ?? 0) / pagination.pageSize));

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.developer ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "code",
      header: "Mã dự án",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên dự án",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "developer",
      header: "Chủ đầu tư",
      cell: ({ row }) => (
        <span className="text-sm text-foreground-muted">{row.original.developer ?? "-"}</span>
      ),
    },
    {
      accessorKey: "province",
      header: "Vị trí",
      cell: ({ row }) => {
        const parts = [
          row.original.district?.name,
          row.original.province?.name,
        ].filter(Boolean);
        return (
          <span className="text-sm text-foreground-muted">
            {parts.length > 0 ? parts.join(", ") : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "_count.properties",
      header: "Số BĐS",
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted">
          {row.original._count?.properties ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status] ?? "default"}>
          {statusLabel[row.original.status] ?? row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Can I="DELETE_OWN" a="PROPERTY">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Xóa dự án"
            className="text-foreground-muted hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setPendingDelete(row.original);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dự án"
        title="Quản lý dự án"
        description="Quản lý toàn bộ dự án và quỹ căn trong hệ thống"
        actions={
          <Can I="CREATE" a="PROPERTY">
            <Button onClick={() => router.push(portalPath("/projects/new"))}>
              <Plus size={16} />
              Thêm dự án
            </Button>
          </Can>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-auto min-w-0"
            />
            <Button variant="outline" size="icon" aria-label="Bộ lọc" className="shrink-0">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={filtered}
              onRowClick={(row) => router.push(portalPath(`/projects/${row.id}`))}
              emptyMessage="Không tìm thấy dự án nào"
            />
            <PaginationBar
              pageSize={pagination.pageSize}
              setPageSize={pagination.setPageSize}
              currentPage={pagination.currentPage}
              setCurrentPage={pagination.setCurrentPage}
              totalPages={totalPages}
            />
          </>
        ) : (
          <EmptyState
            icon={<Building2 size={24} />}
            title="Chưa có dự án"
            description="Tạo dự án đầu tiên để nhóm bất động sản theo dự án"
            action={
              <Can I="CREATE" a="PROPERTY">
                <Button onClick={() => router.push(portalPath("/projects/new"))}>
                  <Plus size={16} />
                  Thêm dự án
                </Button>
              </Can>
            }
          />
        )}
      </div>

      <DeleteProjectDialog
        project={pendingDelete}
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onRefetch={refetch}
      />
    </div>
  );
}
