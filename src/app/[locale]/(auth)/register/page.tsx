"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";

const registerSchema = z.object({
  fullName: z.string().min(2, "Ho ten phai co it nhat 2 ky tu"),
  email: z.string().email("Email khong hop le"),
  password: z.string().min(8, "Mat khau phai co it nhat 8 ky tu"),
  phone: z.string().min(10, "So dien thoai khong hop le"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);
    try {
      await apiClient.post("/auth/register", data);
      router.push("/login");
    } catch {
      setError("Khong the dang ky. Email co the da ton tai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <span className="font-serif text-3xl font-semibold tracking-tight">
          RealHub
        </span>
        <p className="mt-1 text-sm text-foreground-muted">
          Tao tai khoan moi
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Dang ky</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Dien thong tin de tao tai khoan
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Ho va ten</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyen Van An"
              {...register("fullName")}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="text-xs text-accent-red-text">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="an.nguyen@example.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-accent-red-text">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">So dien thoai</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0901234567"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-xs text-accent-red-text">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Mat khau</Label>
            <Input
              id="password"
              type="password"
              placeholder="It nhat 8 ky tu"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-accent-red-text">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-md bg-accent-red/10 px-4 py-3 text-sm text-accent-red-text"
            >
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Dang dang ky..." : "Dang ky"}
          </Button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground"
        >
          <span>Da co tai khoan? Dang nhap</span>
          <span className="inline-flex size-5 items-center justify-center rounded-lg bg-surface-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
            <ArrowUpRight size={12} />
          </span>
        </Link>
      </div>
    </div>
  );
}
