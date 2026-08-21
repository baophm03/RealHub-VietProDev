"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Key,
  Loader2,
  Lock,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Can } from "@casl/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetApiPermissions } from "@/lib/api/endpoints/permissions";
import {
  useGetApiRoleId,
  usePutApiRoleIdPermissions,
  getGetApiRolesQueryKey,
  getGetApiRoleIdQueryKey,
} from "@/lib/api/endpoints/roles";
import type { PermissionEntryDto } from "@/lib/api/models/permissionEntryDto";
import {
  buildPermissionSet,
  hasPermissionInSet,
  togglePermissionInSet,
  type PermissionKey,
} from "@/config/permissions";
import { cn } from "@/lib/utils";
import { RoleUsersTab } from "./role-users-tab";
import type {
  Role,
  RoleDetailResponse,
  PermissionActionDef,
  PermissionModuleDef,
  PermissionsResponse,
} from "./types";

interface PermissionDialogProps {
  roleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermissionDialog({ roleId, open, onOpenChange }: PermissionDialogProps) {
  const queryClient = useQueryClient();

  const { data: permissionsData } = useGetApiPermissions();
  const permissionModules: PermissionModuleDef[] =
    (permissionsData as unknown as PermissionsResponse)?.data ?? [];

  const { data: roleData, isLoading: roleLoading } = useGetApiRoleId(roleId ?? "", {
    query: { enabled: open && !!roleId },
  });
  const role: Role | null = (roleData as unknown as RoleDetailResponse)?.data ?? null;

  const [permissionSet, setPermissionSet] = useState<Set<PermissionKey>>(new Set());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (role) {
      setPermissionSet(
        buildPermissionSet(
          role.permissions.map((p) => ({ module: p.module, action: p.action })),
        ),
      );
      setSearch("");
    }
  }, [role?.id, role?.permissions.length]);

  const { mutateAsync: updatePermissions } = usePutApiRoleIdPermissions();

  const isLocked = role?.code === "SUPER_ADMIN";

  const filteredModules = useMemo(() => {
    if (!search.trim()) return permissionModules;
    const q = search.toLowerCase();
    return permissionModules.filter(
      (m) =>
        m.module.toLowerCase().includes(q) ||
        m.label.toLowerCase().includes(q),
    );
  }, [permissionModules, search]);

  const handleToggle = useCallback(
    (module: string, action: string) => {
      if (isLocked) return;
      setPermissionSet((prev) => togglePermissionInSet(prev, module, action));
    },
    [isLocked],
  );

  const handleToggleModule = useCallback(
    (moduleActions: PermissionActionDef[], module: string) => {
      if (isLocked) return;
      setPermissionSet((prev) => {
        const next = new Set(prev);
        const allChecked = moduleActions.every((a) =>
          hasPermissionInSet(next, module, a.action),
        );
        for (const a of moduleActions) {
          const key = `${module}:${a.action}`;
          if (allChecked) next.delete(key);
          else next.add(key);
        }
        return next;
      });
    },
    [isLocked],
  );

  const hasChanges = useMemo(() => {
    if (!role) return false;
    const original = buildPermissionSet(
      role.permissions.map((p) => ({ module: p.module, action: p.action })),
    );
    if (permissionSet.size !== original.size) return true;
    for (const key of permissionSet) {
      if (!original.has(key)) return true;
    }
    return false;
  }, [role, permissionSet]);

  const handleSave = async () => {
    if (!role || !roleId) return;
    setSaving(true);
    try {
      const perms: PermissionEntryDto[] = Array.from(permissionSet).map((key) => {
        const [module, action] = key.split(":");
        return { module, action };
      });
      await updatePermissions({
        id: roleId,
        data: { permissions: perms },
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetApiRoleIdQueryKey(roleId) }),
      ]);
      toast.success(`Đã cập nhật quyền cho role "${role.name}"`);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message?.[0] ?? "Lưu quyền thất bại";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key size={18} />
              Phân quyền: {roleLoading ? "..." : role?.name}
              {isLocked && (
                <Badge variant="yellow" className="ml-1">
                  <Lock size={10} />
                  Khóa
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {role?.description || "Chọn các quyền cho role này"}
            </DialogDescription>
          </DialogHeader>

          {isLocked && (
            <div className="rounded-lg bg-accent-yellow/20 px-4 py-3 text-sm text-accent-yellow-text flex items-center gap-2">
              <Lock size={14} />
              SUPER_ADMIN có toàn quyền, không thể chỉnh sửa.
            </div>
          )}

          <Tabs defaultValue="permissions" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full">
              <TabsTrigger value="permissions">
                <Key size={14} />
                Quyền
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users size={14} />
                Thành viên
                {role && (role._count?.memberships ?? 0) > 0 && (
                  <Badge variant="default" className="ml-1 text-[10px] tabular-nums">
                    {role._count?.memberships}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── Tab: Permissions ── */}
            <TabsContent value="permissions" className="flex-1 flex flex-col min-h-0 gap-3">
              <Input
                type="search"
                placeholder="Tìm module..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />

              <div className="flex-1 overflow-y-auto -mx-2 px-2">
                {permissionModules.length === 0 && !search ? (
                  <div className="flex items-center justify-center py-8 text-sm text-foreground-muted">
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Đang tải danh sách quyền...
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredModules.map((mod) => {
                      const allChecked = mod.actions.every((a) =>
                        hasPermissionInSet(permissionSet, mod.module, a.action),
                      );
                      const someChecked = mod.actions.some((a) =>
                        hasPermissionInSet(permissionSet, mod.module, a.action),
                      );

                      return (
                        <div
                          key={mod.module}
                          className="rounded-lg border border-border bg-surface/50 p-3"
                        >
                          <div className="flex items-center gap-3 pb-2 border-b border-border">
                            <Checkbox
                              checked={allChecked}
                              indeterminate={!allChecked && someChecked}
                              disabled={isLocked}
                              onCheckedChange={() =>
                                handleToggleModule(mod.actions, mod.module)
                              }
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{mod.label}</span>
                              <span className="text-[10px] font-mono uppercase tracking-wide text-foreground-muted">
                                {mod.module}
                              </span>
                            </div>
                            {mod.description && (
                              <span className="ml-auto text-xs text-foreground-muted">
                                {mod.description}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-1 pt-2 sm:grid-cols-3 md:grid-cols-4">
                            {mod.actions.map((act) => {
                              const checked = hasPermissionInSet(
                                permissionSet,
                                mod.module,
                                act.action,
                              );
                              return (
                                <label
                                  key={act.action}
                                  className={cn(
                                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                                    isLocked
                                      ? "cursor-not-allowed opacity-60"
                                      : "hover:bg-surface-muted",
                                  )}
                                >
                                  <Checkbox
                                    checked={checked}
                                    disabled={isLocked}
                                    onCheckedChange={() =>
                                      handleToggle(mod.module, act.action)
                                    }
                                  />
                                  <span className="flex flex-col">
                                    <span>{act.label}</span>
                                    <span className="text-[10px] font-mono uppercase text-foreground-muted">
                                      {act.action}
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
                <span className="text-xs text-foreground-muted">
                  {permissionSet.size} quyền đã chọn
                  {hasChanges && " • có thay đổi chưa lưu"}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={saving}
                  >
                    Hủy
                  </Button>
                  <Can I="UPDATE" a="TENANT">
                    <Button
                      onClick={handleSave}
                      disabled={saving || isLocked || !hasChanges}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Lưu
                        </>
                      )}
                    </Button>
                  </Can>
                </div>
              </div>
            </TabsContent>

            {/* ── Tab: Users ── */}
            <TabsContent value="users" className="flex-1 flex flex-col min-h-0">
              {roleId && (
                <RoleUsersTab roleId={roleId} isLocked={isLocked} />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
