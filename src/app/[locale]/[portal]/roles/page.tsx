"use client";

import { useState, useMemo } from "react";
import { Key, Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Can } from "@casl/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { usePagination } from "@/lib/hooks/use-pagination";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetApiRoles } from "@/lib/api/endpoints/roles";
import type { GetApiRolesStatus } from "@/lib/api/models/getApiRolesStatus";
import { PermissionDialog } from "./_components/permission-dialog";
import { RoleFormDialog } from "./_components/role-form-dialog";
import { DeleteRoleDialog } from "./_components/delete-role-dialog";
import type { Role, RolesResponse } from "./_components/types";

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<GetApiRolesStatus | "ALL">("ALL");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const pagination = usePagination(10);
  const { data: rolesData, isLoading } = useGetApiRoles({
    search: search.trim() || undefined,
    status: statusFilter === "ALL" ? undefined : (statusFilter as GetApiRolesStatus),
  });
  const allRoles: Role[] = (rolesData as unknown as RolesResponse)?.data ?? [];
  // Roles API doesn't support limit/offset yet — slice client-side
  const roles = allRoles.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  );
  const totalPages = Math.max(1, Math.ceil(allRoles.length / pagination.pageSize));

  const handleOpenPermissions = (roleId: string) => {
    setSelectedRoleId(roleId);
    setPermDialogOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditTarget(role);
  };

  const handleOpenDelete = (role: Role) => {
    setDeleteTarget(role);
  };

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Role",
        size: 220,
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs font-mono uppercase tracking-wide text-foreground-muted">
              {row.original.code}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        size: 500,
        cell: ({ row }) => (
          <span className="line-clamp-2 text-sm text-foreground-muted">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        id: "permissions",
        header: "Quyền",
        size: 100,
        cell: ({ row }) => (
          <Badge variant="default" className="tabular-nums">
            {row.original._count?.permissions ?? 0} quyền
          </Badge>
        ),
      },
      {
        id: "members",
        header: "Thành viên",
        size: 120,
        cell: ({ row }) => (
          <span className="tabular-nums text-sm text-foreground-muted">
            {row.original._count?.membershipRoles ?? 0}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const isActive = row.original.status === "ACTIVE";
          return (
            <Badge variant={isActive ? "green" : "default"}>
              {isActive ? "Hoạt động" : "Tắt"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Phân quyền"
              onClick={() => handleOpenPermissions(row.original.id)}
              title="Phân quyền"
            >
              <Key size={14} />
            </Button>
            <Can I="UPDATE" a="ROLE">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Chỉnh sửa"
                onClick={() => handleOpenEdit(row.original)}
                title="Chỉnh sửa"
              >
                <Pencil size={14} />
              </Button>
            </Can>
            <Can I="DELETE" a="ROLE">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Xóa"
                onClick={() => handleOpenDelete(row.original)}
                title="Xóa"
              >
                <Trash2 size={14} />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [],
  );

  const statusFilters: { value: GetApiRolesStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Tắt" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hệ thống"
        title="Phân quyền"
        description="Quản lý role và permission matrix cho tenant"
        actions={
          <Can I="CREATE" a="ROLE">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus size={16} />
              Thêm role
            </Button>
          </Can>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto min-w-0"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as GetApiRolesStatus | "ALL")}
          items={statusFilters.map((f) => ({ value: f.value, label: f.label }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((f) => (
              <SelectItem key={f.value} value={f.value} label={f.label}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-sm text-foreground-muted">
          <Loader2 size={20} className="mr-2 animate-spin" />
          Đang tải...
        </div>
      ) : roles.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={roles}
            emptyMessage="Không tìm thấy role"
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
          icon={<Users size={24} />}
          title="Chưa có role"
          description="Role sẽ được hiển thị tại đây"
          action={
            <Can I="CREATE" a="ROLE">
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus size={16} />
                Thêm role
              </Button>
            </Can>
          }
        />
      )}

      {/* Permission matrix dialog */}
      <PermissionDialog
        roleId={selectedRoleId}
        open={permDialogOpen}
        onOpenChange={setPermDialogOpen}
      />

      {/* Create role dialog */}
      <RoleFormDialog
        mode="create"
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit role dialog */}
      <RoleFormDialog
        mode="edit"
        role={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />

      {/* Delete role dialog */}
      <DeleteRoleDialog
        role={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
