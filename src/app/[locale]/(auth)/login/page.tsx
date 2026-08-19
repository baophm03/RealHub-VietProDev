"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUserStore } from "@/lib/stores/user-store";
import { useForm } from "react-hook-form";
import { usePostApiLogin } from "@/lib/api/endpoints/auth";
import { useGetApiMe } from "@/lib/api/endpoints/auth";
import { GetAuthMeResponse } from "@/lib/api/types/auth-me";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // store
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useUserStore((s) => s.setUser);

  const { refetch: getProfile } = useGetApiMe({
    query: { enabled: false },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "admin@demo.realhub.local",
      password: "Admin@123456",
    },
  });

  // mutation
  const { mutate: login, isPending } = usePostApiLogin({
    mutation: {
      onSuccess: async (res: any) => {
        setAuth({
          activeTenantId: res?.data?.activeTenantId,
          expiresIn: res?.data?.expiresIn,
          roleInTenant: res?.data?.roleInTenant,
          sessionId: res?.data?.sessionId,
          accessToken: res?.data?.accessToken,
          refreshToken: res?.data?.refreshToken,
        });

        const profile = await getProfile();
        const profileData = (profile.data as unknown as GetAuthMeResponse)?.data;

        if (profileData) {
          setUser({
            id: profileData.id,
            email: profileData.email,
            fullName: profileData.fullName,
            phone: profileData.phone,
            avatarUrl: profileData.avatarUrl,
            status: profileData.status,
            role: profileData.role
              ? {
                code: profileData.role.code,
                name: profileData.role.name,
                description: profileData.role.description,
                permissions: profileData.role.permissions.map((p) => ({
                  module: p.module,
                  action: p.action,
                })),
              }
              : null,
            lastLoginAt: profileData.lastLoginAt,
            createdAt: profileData.createdAt,
          });
        }

        router.push("/dashboard");
      },
      onError: (err: any) => {
        const apiError = err?.response?.data?.error;
        const messages = apiError?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : messages || "Đã có lỗi xảy ra vui lòng thử lại";
        setError(errorMessage);
      }
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    setError(null);

    login({
      data: {
        email: formData.email,
        password: formData.password,
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-12 text-center">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
          Real Estate Platform
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground">
          RealHub
        </h1>
        <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
          Nền tảng quản lý bất động sản
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface/80 p-8 shadow-[0_20px_60px_-20px_rgba(45,95,63,0.10)] backdrop-blur-xl md:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight">Đăng nhập</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Nhập thông tin tài khoản để tiếp tục
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@demo.realhub.local"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-accent-red-text">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-[13px] font-medium">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="pr-11"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors duration-300"
                aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-accent-red-text">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-lg bg-accent-red/20 px-4 py-3 text-sm text-accent-red-text"
            >
              {error}
            </div>
          )}

          <Button type="submit" disabled={isPending} className="mt-2 w-full" size="lg">
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/register"
          className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <span>Chưa có tài khoản? Đăng ký</span>
          <span className="inline-flex size-6 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={12} />
          </span>
        </a>
      </div>
    </div>
  );
}
