"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostApiRegister } from "@/lib/api/endpoints/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(10, "Mật khẩu phải có ít nhất 10 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerAccount, isPending } = usePostApiRegister({
    mutation: {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (err: any) => {
        const errorMessage = err?.response?.data?.message || "Đã có lỗi xảy ra vui lòng thử lại";
        setError(errorMessage);
      },
    },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setError(null);

    registerAccount({
      data: {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
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
          Nền tảng quản lý bất động sản đa tenant
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface/80 p-8 shadow-[0_20px_60px_-20px_rgba(45,95,63,0.10)] backdrop-blur-xl md:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight">Đăng ký</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Điền thông tin để tạo tài khoản
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName" className="text-[13px] font-medium">Họ và tên</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn An"
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
                className="pr-11"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors duration-300"
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
            {isPending ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>
      </div>

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
    </div>
  );
}
