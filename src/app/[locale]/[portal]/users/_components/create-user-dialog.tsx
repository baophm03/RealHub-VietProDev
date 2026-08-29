"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
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
import { usePostApiUser } from "@/lib/api/endpoints/users";
import { getGetApiMembershipsQueryKey } from "@/lib/api/endpoints/memberships";
import type { CreateUserDto } from "@/lib/api/models/createUserDto";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: createUser, isPending } = usePostApiUser();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || password.length < 10) {
      toast.error("Vui lòng nhập đủ thông tin (mật khẩu ≥ 10 ký tự)");
      return;
    }
    try {
      const dto: CreateUserDto = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      };
      await createUser({ data: dto });
      await queryClient.invalidateQueries({ queryKey: getGetApiMembershipsQueryKey() });
      router.refresh();
      toast.success(`Đã tạo người dùng "${fullName.trim()}"`);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message?.[0] ?? "Tạo người dùng thất bại";
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
              <UserPlus size={18} />
              Thêm người dùng
            </DialogTitle>
            <DialogDescription>
              Tạo tài khoản mới trong tenant hiện tại.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-fullname">Họ và tên *</Label>
              <Input
                id="user-fullname"
                placeholder="Nguyễn Văn An"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="an.nguyen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-phone">Số điện thoại</Label>
              <Input
                id="user-phone"
                type="tel"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-password">Mật khẩu *</Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Ít nhất 10 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-foreground-muted">
                Mật khẩu tạm thời — người dùng nên đổi sau khi đăng nhập.
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
                  Đang tạo...
                </>
              ) : (
                <>
                  <UserPlus size={14} />
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
