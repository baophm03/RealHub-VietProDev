"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Lock, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  usePatchApiRoleId,
  getGetApiRolesQueryKey,
  getGetApiRoleIdQueryKey,
} from "@/lib/api/endpoints/roles";
import type { UpdateRoleDto } from "@/lib/api/models/updateRoleDto";
import type { Role } from "./types";

interface EditRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({ role, open, onOpenChange }: EditRoleDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: patchRole, isPending } = usePatchApiRoleId();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setStatus(role.status);
    }
  }, [role?.id]);

  const isLocked = role?.code === "SUPER_ADMIN";

  const handleSubmit = async () => {
    if (!role) return;
    if (!name.trim()) {
      toast.error("Tên role không được để trống");
      return;
    }
    try {
      const dto: UpdateRoleDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        status,
      };
      await patchRole({ id: role.id, data: dto });
      await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetApiRoleIdQueryKey(role.id) });
      toast.success(`Đã cập nhật role "${name.trim()}"`);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Cập nhật role thất bại";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil size={18} />
              Chỉnh sửa role
              {isLocked && (
                <Badge variant="yellow" className="ml-1">
                  <Lock size={10} />
                  Khóa
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin role. Mã role ({role?.code}) không thể thay đổi.
            </DialogDescription>
          </DialogHeader>

          {isLocked && (
            <div className="rounded-lg bg-accent-yellow/20 px-4 py-3 text-sm text-accent-yellow-text flex items-center gap-2">
              <Lock size={14} />
              SUPER_ADMIN không thể chỉnh sửa.
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-role-code">Mã role</Label>
              <Input
                id="edit-role-code"
                value={role?.code ?? ""}
                disabled
                className="font-mono uppercase opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-role-name">Tên hiển thị</Label>
              <Input
                id="edit-role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLocked}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-role-desc">Mô tả</Label>
              <Textarea
                id="edit-role-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isLocked}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-role-status">Trạng thái</Label>
              <select
                id="edit-role-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isLocked}
                className="h-9 rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Tắt</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || isLocked}>
              {isPending ? (
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
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
