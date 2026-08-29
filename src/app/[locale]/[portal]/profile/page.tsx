"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-section";
import { useUserStore } from "@/lib/stores/user-store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePatchApiMe, usePatchApiPassword } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";

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

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(10, "Mật khẩu phải có ít nhất 10 ký tự"),
  confirmPassword: z.string().min(10, "Mật khẩu phải có ít nhất 10 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Mật khẩu mới phải khác mật khẩu hiện tại",
  path: ["newPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [savingProfile, setSavingProfile] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { mutateAsync: updateProfile } = usePatchApiMe();
  const { mutateAsync: changePassword, isPending: changingPassword } = usePatchApiPassword();

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

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
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

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword({
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      });
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      resetPassword();
      logout();
      router.push("/login");
    } catch (err) {
      toast.error(
        (err as any)?.response?.data?.error?.message?.[0] ||
        (err as any)?.response?.data?.message ||
        "Có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại"
      );
      console.error(err);
    }
  };

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
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label="Mật khẩu hiện tại" htmlFor="currentPassword" required error={passwordErrors.currentPassword?.message}>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="pr-11"
                    {...registerPassword("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
              <FormField label="Mật khẩu mới" htmlFor="newPassword" required error={passwordErrors.newPassword?.message}>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Ít nhất 10 ký tự"
                    className="pr-11"
                    {...registerPassword("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
              <FormField label="Xác nhận mật khẩu" htmlFor="confirmPassword" required error={passwordErrors.confirmPassword?.message}>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    className="pr-11"
                    {...registerPassword("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                    aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled={changingPassword}>
                {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
