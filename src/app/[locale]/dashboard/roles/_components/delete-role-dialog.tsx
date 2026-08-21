"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  useDeleteApiRoleId,
  getGetApiRolesQueryKey,
} from "@/lib/api/endpoints/roles";
import type { Role } from "./types";

interface DeleteRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoleDialog({ role, open, onOpenChange }: DeleteRoleDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRole, isPending } = useDeleteApiRoleId();

  const isSystem = role?.isSystem;
  const hasMembers = (role?._count?.memberships ?? 0) > 0;
  const canDelete = !isSystem && !hasMembers;

  const handleDelete = async () => {
    if (!role) return;
    try {
      await deleteRole({ id: role.id });
      await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
      toast.success(`Đã xóa role "${role.name}"`);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message?.[0] ?? "Xóa role thất bại";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa role</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {role && (
            <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{role.name}</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {role.code}
                </Badge>
              </div>
              {role.description && (
                <p className="mt-1 text-foreground-muted">{role.description}</p>
              )}
              <p className="mt-2 text-xs text-foreground-muted">
                {role._count?.permissions ?? 0} quyền • {role._count?.memberships ?? 0} thành viên
              </p>
            </div>
          )}

          {isSystem && (
            <div className="rounded-lg bg-accent-red/10 px-4 py-3 text-sm text-accent-red flex items-center gap-2">
              <Lock size={14} />
              Role hệ thống không thể xóa.
            </div>
          )}

          {!isSystem && hasMembers && (
            <div className="rounded-lg bg-accent-yellow/20 px-4 py-3 text-sm text-accent-yellow-text">
              Không thể xóa: role đang có {role?._count?.memberships} thành viên.
              Vui lòng gán lại user sang role khác trước khi xóa.
            </div>
          )}

          {canDelete && (
            <div className="rounded-lg bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
              Bạn có chắc chắn muốn xóa role này? Tất cả quyền sẽ bị xóa theo.
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending || !canDelete}
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Xóa
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
