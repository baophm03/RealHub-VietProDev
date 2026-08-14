"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Spinner, Check } from "@phosphor-icons/react";
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
import {
  usePostApiRole,
  getGetApiRolesQueryKey,
} from "@/lib/api/endpoints/roles";
import type { CreateRoleDto } from "@/lib/api/models/createRoleDto";

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: createRole, isPending } = usePostApiRole();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setCode("");
    setName("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Vui lòng nhập mã role và tên");
      return;
    }
    try {
      const dto: CreateRoleDto = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        isSystem: false,
      };
      await createRole({ data: dto });
      await queryClient.invalidateQueries({ queryKey: getGetApiRolesQueryKey() });
      toast.success(`Đã tạo role "${name.trim()}"`);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Tạo role thất bại";
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
              <Plus size={18} />
              Thêm role mới
            </DialogTitle>
            <DialogDescription>
              Tạo role cho tenant. Có thể phân quyền sau khi tạo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-code">Mã role *</Label>
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
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-name">Tên hiển thị *</Label>
              <Input
                id="role-name"
                placeholder="VD: Hỗ trợ khách hàng"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-desc">Mô tả</Label>
              <Textarea
                id="role-desc"
                placeholder="Mô tả ngắn về role này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
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
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size={14} className="animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Tạo
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
