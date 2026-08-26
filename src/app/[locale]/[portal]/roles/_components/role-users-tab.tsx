"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Can } from "@casl/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetApiRoleIdUsers,
  usePostApiRoleIdUsers,
  useDeleteApiRoleIdUsersUserId,
  getGetApiRoleIdUsersQueryKey,
  getGetApiRolesQueryKey,
} from "@/lib/api/endpoints/roles";
import { useGetApiUsers } from "@/lib/api/endpoints/users";
import type {
  RoleUser,
  RoleUsersResponse,
  TenantUser,
  TenantUsersResponse,
} from "./types";

interface RoleUsersTabProps {
  roleId: string;
}

export function RoleUsersTab({ roleId }: RoleUsersTabProps) {
  const queryClient = useQueryClient();

  const { data: roleUsersData, isLoading } = useGetApiRoleIdUsers(roleId, {
    query: { enabled: !!roleId },
  });
  const roleUsers: RoleUser[] =
    (roleUsersData as unknown as RoleUsersResponse)?.data ?? [];

  const { data: tenantUsersData } = useGetApiUsers({ limit: "100", offset: "0" });
  const tenantUsers: TenantUser[] =
    (tenantUsersData as unknown as TenantUsersResponse)?.data ?? [];

  const { mutateAsync: assignUsers, isPending: assigning } = usePostApiRoleIdUsers();
  const { mutateAsync: removeUser, isPending: removing } = useDeleteApiRoleIdUsersUserId();

  const [showPicker, setShowPicker] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const availableUsers = useMemo(() => {
    const inRoleIds = new Set(roleUsers.map((u) => u.userId));
    let list = tenantUsers.filter((u) => !inRoleIds.has(u.userId));
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone ?? "").includes(q),
      );
    }
    return list;
  }, [tenantUsers, roleUsers, userSearch]);

  const toggleSelect = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleAssign = async () => {
    if (selectedUserIds.size === 0) return;
    try {
      await assignUsers({
        id: roleId,
        data: { userIds: Array.from(selectedUserIds) },
      });
      await queryClient.invalidateQueries({
        queryKey: getGetApiRoleIdUsersQueryKey(roleId),
      });
      await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
      toast.success(`Đã gán ${selectedUserIds.size} người dùng vào role`);
      setSelectedUserIds(new Set());
      setShowPicker(false);
      setUserSearch("");
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message?.[0] ?? "Gán người dùng thất bại";
      toast.error(msg);
    }
  };

  const handleRemove = async (userId: string, fullName: string) => {
    try {
      await removeUser({ id: roleId, userId });
      await queryClient.invalidateQueries({
        queryKey: getGetApiRoleIdUsersQueryKey(roleId),
      });
      await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
      toast.success(`Đã xóa "${fullName}" khỏi role`);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message?.[0] ?? "Xóa người dùng thất bại";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-foreground-muted">
        <Loader2 size={16} className="mr-2 animate-spin" />
        Đang tải danh sách thành viên...
      </div>
    );
  }

  if (showPicker) {
    return (
      <div className="flex flex-1 flex-col gap-3 min-h-0">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm người dùng..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowPicker(false);
              setSelectedUserIds(new Set());
              setUserSearch("");
            }}
          >
            <X size={16} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {availableUsers.length === 0 ? (
            <div className="py-8 text-center text-sm text-foreground-muted">
              Không có người dùng nào để gán
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {availableUsers.map((u) => {
                const selected = selectedUserIds.has(u.userId);
                return (
                  <label
                    key={u.userId}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-surface/50 px-3 py-2 text-sm hover:bg-surface-muted"
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => toggleSelect(u.userId)}
                    />
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{u.fullName}</span>
                        <span className="text-xs text-foreground-muted">{u.email}</span>
                      </div>
                      {u.roleName && (
                        <Badge variant="outline" className="ml-auto text-[10px]">
                          {u.roleName}
                        </Badge>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
          <span className="text-xs text-foreground-muted">
            {selectedUserIds.size} người dùng đã chọn
          </span>
          <Button
            onClick={handleAssign}
            disabled={assigning || selectedUserIds.size === 0}
          >
            {assigning ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Đang gán...
              </>
            ) : (
              <>
                <UserPlus size={14} />
                Gán vào role
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0">
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground-muted">
          {roleUsers.length} thành viên
        </span>
        <Can I="UPDATE" a="ROLE">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPicker(true)}
          >
            <UserPlus size={14} />
            Gán người dùng
          </Button>
        </Can>
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 px-2">
        {roleUsers.length === 0 ? (
          <div className="py-8 text-center text-sm text-foreground-muted">
            Chưa có thành viên nào trong role này
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {roleUsers.map((u) => (
              <div
                key={u.membershipId}
                className="flex items-center gap-3 rounded-md border border-border bg-surface/50 px-3 py-2 text-sm"
              >
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{u.fullName}</span>
                    {u.userStatus !== "ACTIVE" && (
                      <Badge variant="default" className="text-[10px]">
                        {u.userStatus}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-foreground-muted">{u.email}</span>
                </div>
                <span className="text-xs text-foreground-muted tabular-nums">
                  {new Date(u.joinedAt).toLocaleDateString("vi-VN")}
                </span>
                <Can I="UPDATE" a="ROLE">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Xóa khỏi role"
                    onClick={() => handleRemove(u.userId, u.fullName)}
                    disabled={removing}
                    title="Xóa khỏi role"
                  >
                    <X size={14} />
                  </Button>
                </Can>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
