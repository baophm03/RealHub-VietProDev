"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-section";
import { useUserStore } from "@/lib/stores/user-store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetApiUserId, usePatchApiUserId } from "@/lib/api/endpoints/users";

interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  phoneNormalized?: string | null;
  avatarUrl?: string | null;
  status: string;
  lastLoginAt?: string | null;
  createdAt?: string;
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional().or(z.literal("")),
  avatarUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const { data: userResponse, isLoading } = useGetApiUserId(user?.id ?? "");
  const apiUser = (userResponse as unknown as { data?: UserResponse })?.data;
  const current = apiUser ?? user;

  const { mutateAsync: updateUser } = usePatchApiUserId();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: current?.fullName ?? "",
      phone: current?.phone ?? "",
      avatarUrl: current?.avatarUrl ?? "",
    },
  });

  // Sync form when API data arrives
  useEffect(() => {
    if (apiUser) {
      reset({
        fullName: apiUser.fullName ?? "",
        phone: apiUser.phone ?? "",
        avatarUrl: apiUser.avatarUrl ?? "",
      });
    }
  }, [apiUser, reset]);

  const initials =
    current?.fullName
      ?.split(" ")
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await updateUser({
        id: user.id,
        data: {
          fullName: data.fullName,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
        },
      });
      const updated = (result as unknown as { data?: UserResponse })?.data;

      // Update store
      if (updated && user) {
        setUser({
          ...user,
          fullName: updated.fullName,
          phone: updated.phone,
          avatarUrl: updated.avatarUrl,
        });
      }
      toast.success("Đã cập nhật hồ sơ");
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật, vui lòng thử lại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !current) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Tài khoản" title="Hồ sơ cá nhân" description="Thông tin tài khoản và mật khẩu" />
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Tài khoản" title="Hồ sơ cá nhân" description="Thông tin tài khoản và mật khẩu" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-6">
            <Avatar className="size-20 rounded-full overflow-hidden">
              {user?.avatarUrl && (
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user?.fullName ?? "User"}
                />
              )}
              <AvatarFallback className="flex size-20 items-center justify-center rounded-full bg-surface-muted text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">{current?.fullName ?? "User"}</p>
              <p className="text-xs text-foreground-muted">{current?.email}</p>
            </div>
            {user && user.role && <Badge variant="blue">{user.role.name}</Badge>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Họ và tên" htmlFor="fullName" required error={errors.fullName?.message}>
                  <Input id="fullName" placeholder="Nguyễn Văn An" {...register("fullName")} />
                </FormField>
                <FormField label="Email" htmlFor="email">
                  <Input id="email" defaultValue={current?.email ?? ""} disabled />
                </FormField>
                <FormField label="Số điện thoại" htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" placeholder="0901234567" {...register("phone")} />
                </FormField>
                <FormField label="Ảnh đại diện URL" htmlFor="avatarUrl" error={errors.avatarUrl?.message}>
                  <Input id="avatarUrl" placeholder="https://..." {...register("avatarUrl")} />
                </FormField>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Đổi mật khẩu</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label="Mật khẩu hiện tại" required>
                <Input type="password" placeholder="Nhập mật khẩu hiện tại" disabled />
              </FormField>
              <FormField label="Mật khẩu mới" required>
                <Input type="password" placeholder="Nhập mật khẩu mới" disabled />
              </FormField>
              <FormField label="Xác nhận mật khẩu" required>
                <Input type="password" placeholder="Nhập lại mật khẩu mới" disabled />
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled>Đổi mật khẩu</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
