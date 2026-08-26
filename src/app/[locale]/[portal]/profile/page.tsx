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
import { usePatchApiMe } from "@/lib/api/endpoints/auth";

interface MeData {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

interface MeResponse {
  success: boolean;
  data: MeData;
  timestamp: string;
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
  const [savingProfile, setSavingProfile] = useState(false);

  const { mutateAsync: updateProfile } = usePatchApiMe();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName ?? "",
        phone: user.phone ?? "",
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [user, resetProfile]);

  const initials =
    user?.fullName
      ?.split(" ")
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const onProfileSubmit = async (data: ProfileFormData) => {
    setSavingProfile(true);
    try {
      const result = await updateProfile({
        data: {
          fullName: data.fullName,
          phone: data.phone || undefined,
          avatarUrl: data.avatarUrl || undefined,
        },
      });
      const updated = (result as unknown as MeResponse)?.data ?? null;

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
      toast.error(
        (err as any)?.response?.data?.error?.message?.[0] ||
        "Có lỗi xảy ra khi cập nhật, vui lòng thử lại"
      );
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
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
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.fullName ?? "User"} />
              )}
              <AvatarFallback className="flex size-20 items-center justify-center rounded-full bg-surface-muted text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">{user.fullName ?? "User"}</p>
              <p className="text-xs text-foreground-muted">{user.email}</p>
            </div>
            {user.roles?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {user.roles.map((r) => (
                  <Badge key={r.code} variant="blue">{r.name}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Họ và tên" htmlFor="fullName" required error={profileErrors.fullName?.message}>
                  <Input id="fullName" placeholder="Nguyễn Văn An" {...registerProfile("fullName")} />
                </FormField>
                <FormField label="Email" htmlFor="email">
                  <Input id="email" defaultValue={user.email ?? ""} disabled />
                </FormField>
                <FormField label="Số điện thoại" htmlFor="phone" error={profileErrors.phone?.message}>
                  <Input id="phone" placeholder="0901234567" {...registerProfile("phone")} />
                </FormField>
                <FormField label="Ảnh đại diện URL" htmlFor="avatarUrl" error={profileErrors.avatarUrl?.message}>
                  <Input id="avatarUrl" placeholder="https://..." {...registerProfile("avatarUrl")} />
                </FormField>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
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
              <FormField label="Mật khẩu hiện tại" htmlFor="currentPassword" required>
                <Input id="currentPassword" type="password" placeholder="Nhập mật khẩu hiện tại" disabled />
              </FormField>
              <FormField label="Mật khẩu mới" htmlFor="newPassword" required>
                <Input id="newPassword" type="password" placeholder="Nhập mật khẩu mới" disabled />
              </FormField>
              <FormField label="Xác nhận mật khẩu" htmlFor="confirmPassword" required>
                <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới" disabled />
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
