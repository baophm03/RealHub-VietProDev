"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  usePostApiRole,
  usePatchApiRoleId,
  getGetApiRolesQueryKey,
  getGetApiRoleIdQueryKey,
} from "@/lib/api/endpoints/roles";
import type { CreateRoleDto } from "@/lib/api/models/createRoleDto";
import type { UpdateRoleDto } from "@/lib/api/models/updateRoleDto";
import type { Role } from "./types";

interface RoleFormDialogProps {
  mode: "create" | "edit";
  role?: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleFormDialog({ mode, role, open, onOpenChange }: RoleFormDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: createRole, isPending: isCreating } = usePostApiRole();
  const { mutateAsync: patchRole, isPending: isPatching } = usePatchApiRoleId();
  const isPending = isCreating || isPatching;
  const isEdit = mode === "edit";

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (isEdit && role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setStatus(role.status);
    } else if (!isEdit) {
      setCode("");
      setName("");
      setDescription("");
    }
  }, [role?.id, open, isEdit]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(isEdit ? "Tên role không được để trống" : "Vui lòng nhập mã role và tên");
      return;
    }
    if (!isEdit && !code.trim()) {
      toast.error("Vui lòng nhập mã role");
      return;
    }
    try {
      if (isEdit && role) {
        const dto: UpdateRoleDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          status,
        };
        await patchRole({ id: role.id, data: dto });
        await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetApiRoleIdQueryKey(role.id) });
        toast.success(`Đã cập nhật role "${name.trim()}"`);
      } else {
        const dto: CreateRoleDto = {
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
        };
        await createRole({ data: dto });
        await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
        toast.success(`Đã tạo role "${name.trim()}"`);
      }
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message?.[0] ?? (isEdit ? "Cập nhật role thất bại" : "Tạo role thất bại");
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
              {isEdit ? <Pencil size={18} /> : <Plus size={18} />}
              {isEdit ? "Chỉnh sửa role" : "Thêm role mới"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? `Cập nhật thông tin role. Mã role (${role?.code}) không thể thay đổi.`
                : "Tạo role cho tenant. Có thể phân quyền sau khi tạo."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-code">Mã role{!isEdit && " *"}</Label>
              {isEdit ? (
                <Input
                  id="role-code"
                  value={role?.code ?? ""}
                  disabled
                  className="font-mono uppercase opacity-60"
                />
              ) : (
                <>
                  <Input
                    id="role-code"
                    placeholder="VD: CUSTOM_SUPPORT"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="font-mono uppercase"
                  />
                  <p className="text-xs text-foreground-muted">
                    Mã duy nhất trong tenant, viết hoa, không dấu.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-name">Tên hiển thị{!isEdit && " *"}</Label>
              <Input
                id="role-name"
                placeholder={isEdit ? undefined : "VD: Hỗ trợ khách hàng"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-desc">Mô tả</Label>
              <Textarea
                id="role-desc"
                placeholder={isEdit ? undefined : "Mô tả ngắn về role này..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {isEdit && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-status">Trạng thái</Label>
                <Select
                  value={status}
                  items={[
                    { value: "ACTIVE", label: "Hoạt động" },
                    { value: "INACTIVE", label: "Tắt" },
                  ]}
                  onValueChange={(value) => setStatus(value as "ACTIVE" | "INACTIVE")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="INACTIVE">Tắt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  {isEdit ? <Check size={14} /> : <Plus size={14} />}
                  {isEdit ? "Lưu" : "Tạo"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
