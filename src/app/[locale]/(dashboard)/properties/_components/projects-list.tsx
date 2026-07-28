"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Building, Funnel } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { useUserStore } from "@/lib/stores/user-store";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetApiProjects } from "@/lib/api/endpoints/projects";
import { GetProjectsResponse, Project } from "@/lib/api/types/projects";

const statusVariant: Record<string, "green" | "default"> = {
  ACTIVE: "green",
  INACTIVE: "default",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

export function ProjectsList() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: projectsData } = useGetApiProjects();
  const projects = ((projectsData as unknown as GetProjectsResponse)?.data) || [];

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
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, mã, chủ đầu tư..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto min-w-0"
          />
          <Button variant="outline" size="icon" aria-label="Bộ lọc" className="shrink-0">
            <Funnel size={16} />
          </Button>
        </div>
        {mounted && hasPermission("properties:write") && (
          <Button onClick={() => router.push("/properties/projects/new")}>
            <Plus size={16} />
            Thêm dự án
          </Button>
        )}
      </div>

      {filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => router.push(`/properties/projects/${row.id}`)}
          emptyMessage="Không tìm thấy dự án nào"
        />
      ) : (
        <EmptyState
          icon={<Building size={24} />}
          title="Chưa có dự án"
          description="Tạo dự án đầu tiên để nhóm bất động sản theo dự án"
          action={
            mounted && hasPermission("properties:write") && (
              <Button onClick={() => router.push("/properties/projects/new")}>
                <Plus size={16} />
                Thêm dự án
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
