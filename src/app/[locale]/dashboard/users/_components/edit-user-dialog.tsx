"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePatchApiMembershipsId,
  getGetApiMembershipsQueryKey,
} from "@/lib/api/endpoints/memberships";
import { useGetApiRoles } from "@/lib/api/endpoints/roles";
import type { UpdateMembershipDto } from "@/lib/api/models/updateMembershipDto";

export interface MembershipUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: string;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface MembershipRole {
  id: string;
  code: string;
  name: string;
}

export interface MembershipRow {
  id: string;
  userId: string;
  roleId: string | null;
  status: string;
  joinedAt: string;
  invitedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  user: MembershipUser | null;
  role: MembershipRole | null;
}

interface RolesResponse {
  success: boolean;
  data: MembershipRole[];
  timestamp: string;
}

interface EditUserDialogProps {
  membership: MembershipRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ membership, open, onOpenChange }: EditUserDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: patchMembership, isPending } = usePatchApiMembershipsId();

  const { data: rolesData } = useGetApiRoles();
  const roles: MembershipRole[] =
    (rolesData as unknown as RolesResponse)?.data ?? [];

  const [roleId, setRoleId] = useState<string>("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  useEffect(() => {
    if (membership) {
      setRoleId(membership.roleId ?? "__NONE__");
      setStatus((membership.status as "ACTIVE" | "INACTIVE") ?? "ACTIVE");
    }
  }, [membership]);

  const handleSubmit = async () => {
    if (!membership) return;
    try {
      const dto: UpdateMembershipDto = {
        roleId: (roleId === "__NONE__" ? null : roleId) as unknown as UpdateMembershipDto["roleId"],
        status,
      };
      await patchMembership({ id: membership.id, data: dto });
      await queryClient.invalidateQueries({
        queryKey: getGetApiMembershipsQueryKey(),
      });
      toast.success(
        `Đã cập nhật vai trò cho "${membership.user?.fullName ?? membership.userId}"`,
      );
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Cập nhật thất bại";
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
              Chỉnh sửa người dùng
            </DialogTitle>
            <DialogDescription>
              Thay đổi vai trò và trạng thái thành viên trong tenant.
            </DialogDescription>
          </DialogHeader>

          {membership?.user && (
            <div className="rounded-lg border border-border bg-surface-muted/40 p-3 text-sm">
              <p className="font-medium">{membership.user.fullName}</p>
              <p className="text-xs text-foreground-muted">{membership.user.email}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-role">Vai trò</Label>
              <Select
                value={roleId}
                onValueChange={(value) => setRoleId(value ?? "__NONE__")}
                items={roles.map((r) => ({ value: r.id, label: r.name }))}
              >
                <SelectTrigger id="edit-role" className="w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__NONE__" label="— Không có vai trò —">
                    — Không có vai trò —
                  </SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id} label={`${r.name} (${r.code})`}>
                      <span className="font-medium">{r.name}</span>
                      <span className="ml-2 font-mono text-xs text-foreground-muted">
                        {r.code}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground-muted">
                Vai trò quyết định quyền truy cập của người dùng trong tenant.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-status">Trạng thái thành viên</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus((value as "ACTIVE" | "INACTIVE") ?? "ACTIVE")}
                items={[
                  { value: "ACTIVE", label: "Hoạt động" },
                  { value: "INACTIVE", label: "Tắt" },
                ]}
              >
                <SelectTrigger id="edit-status" className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE" label="Hoạt động">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE" label="Tắt">Tắt</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground-muted">
                Đặt "Tắt" để vô hiệu hóa thành viên trong tenant.
              </p>
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
                  <Loader2 size={14} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Pencil size={14} />
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
