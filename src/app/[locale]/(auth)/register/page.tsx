"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostApiRegister } from "@/lib/api/endpoints/auth";
import { AuthCard } from "../_components/auth-card";

const REGISTER_ROLES = [
  { value: "CUSTOMER", label: "Khách hàng", description: "Tìm mua / thuê bất động sản" },
  { value: "OWNER", label: "Chủ bất động sản", description: "Chủ sở hữu muốn đăng tin cho thuê / bán" },
  { value: "SALES", label: "Sales", description: "Bạn là nhân viên sale muốn có thêm thu nhập" },
] as const;

const registerSchema = z.object({
  roleCode: z.enum(["CUSTOMER", "OWNER", "SALES"]),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(10, "Mật khẩu phải có ít nhất 10 ký tự"),
  confirmPassword: z.string().min(10, "Mật khẩu phải có ít nhất 10 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { roleCode: "CUSTOMER" },
  });

  const selectedRole = watch("roleCode");

  const { mutate: registerAccount, isPending } = usePostApiRegister({
    mutation: {
      onSuccess: (_res: unknown, variables: { data: { email: string } }) => {
        router.push(`/verify-otp?email=${encodeURIComponent(variables.data.email)}`);
      },
      onError: (err: any) => {
        const errorMessage = err?.response?.data?.error?.message?.[0] || "Đã có lỗi xảy ra vui lòng thử lại";
        setError(errorMessage);
      },
    },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setError(null);

    registerAccount({
      data: {
        roleCode: formData.roleCode,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      },
    });
  };

  return (
    <AuthCard
      title="Đăng ký"
      subtitle="Chọn vai trò và điền thông tin để tạo tài khoản"
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Cột trái: Chọn vai trò ── */}
        <div className="flex flex-col gap-3">
          <Label className="text-[13px] font-medium">Bạn là ?</Label>
          <div className="flex flex-col gap-2.5">
            {REGISTER_ROLES.map((role) => {
              const isActive = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue("roleCode", role.value, { shouldDirty: true })}
                  className={
                    "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300 " +
                    (isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-surface hover:border-foreground-muted hover:bg-surface-muted/40")
                  }
                  aria-pressed={isActive}
                >
                  <span
                    className={
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors " +
                      (isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border-strong text-transparent group-hover:border-foreground-muted")
                    }
                    aria-hidden="true"
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className={"text-sm font-semibold " + (isActive ? "text-primary" : "text-foreground")}>
                      {role.label}
                    </span>
                    <span className="text-[11px] leading-snug text-foreground-muted">
                      {role.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {errors.roleCode && (
            <p className="text-xs text-accent-red-text">{errors.roleCode.message}</p>
          )}
        </div>

        {/* ── Cột phải: Thông tin đăng ký ── */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName" className="text-[13px] font-medium">Họ và tên</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn An"
              autoComplete="name"
              {...register("fullName")}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-xs text-accent-red-text">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="an.nguyen@example.com"
              autoComplete="email"
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
            <Label htmlFor="phone" className="text-[13px] font-medium">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0901234567"
              autoComplete="tel"
              {...register("phone")}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-accent-red-text">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-[13px] font-medium">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ít nhất 10 ký tự"
                autoComplete="new-password"
                className="pr-11"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors duration-300 hover:text-foreground"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-[13px] font-medium">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                className="pr-11"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors duration-300 hover:text-foreground"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-xs text-accent-red-text">
                {errors.confirmPassword.message}
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

          <Button type="submit" disabled={isPending} className="mt-1 w-full" size="lg">
            {isPending ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <span>Đã có tài khoản? Đăng nhập</span>
          <span className="inline-flex size-6 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={12} />
          </span>
        </Link>
      </div>
    </AuthCard>
  );
}
