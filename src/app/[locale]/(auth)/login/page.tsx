"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";

const loginSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(1, "Vui long nhap mat khau"),
  tenantCode: z.string().min(1, "Vui long nhap ma tenant"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setTenantCode = useAuthStore((s) => s.setTenantCode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantCode: process.env.NEXT_PUBLIC_TENANT_CODE ?? "DEMO",
      email: "admin@demo.realhub.local",
      password: "Admin@123456",
    },
  });

  const fillDemoAccount = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      setTenantCode(data.tenantCode);

      const demoAccounts: Record<string, { password: string; role: "SUPER_ADMIN" | "SALES"; name: string }> = {
        "admin@demo.realhub.local": { password: "Admin@123456", role: "SUPER_ADMIN", name: "Administrator" },
        "sales@demo.realhub.local": { password: "Sales@123456", role: "SALES", name: "Sales Demo" },
      };

      const account = demoAccounts[data.email];
      if (account && account.password === data.password) {
        setAuth({
          accessToken: "mock-access-token-" + Date.now(),
          refreshToken: "mock-refresh-token-" + Date.now(),
          user: {
            id: "mock-user-id",
            email: data.email,
            fullName: account.name,
            role: account.role,
            permissions: account.role === "SUPER_ADMIN" ? ["*"] : [
              "properties:read", "properties:write",
              "customers:read", "customers:write",
              "leads:read", "leads:write",
              "appointments:read", "appointments:write",
              "deals:read", "deals:write",
              "commission:read",
              "files:read", "files:write",
            ],
          },
        });
        router.push("/dashboard");
      } else {
        setError("Email hoac mat khau khong dung. Vui long thu lai.");
      }
    } finally {
      setLoading(false);
    }
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
          Nen tang quan ly bat dong san da tenant
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface/80 p-8 shadow-[0_20px_60px_-20px_rgba(45,95,63,0.10)] backdrop-blur-xl md:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight">Dang nhap</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Nhap thong tin tai khoan de tiep tuc
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tenantCode" className="text-[13px] font-medium">Ma tenant</Label>
            <Input
              id="tenantCode"
              type="text"
              placeholder="DEMO"
              {...register("tenantCode")}
              aria-invalid={!!errors.tenantCode}
              aria-describedby={errors.tenantCode ? "tenantCode-error" : undefined}
            />
            {errors.tenantCode && (
              <p id="tenantCode-error" className="text-xs text-accent-red-text">
                {errors.tenantCode.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="password" className="text-[13px] font-medium">Mat khau</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhap mat khau"
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
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
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

          <Button type="submit" disabled={loading} className="mt-2 w-full" size="lg">
            {loading ? "Dang dang nhap..." : "Dang nhap"}
          </Button>
        </form>

        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted/60">
            Tai khoan demo
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@demo.realhub.local", "Admin@123456")}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface-muted/40 px-4 py-3 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-muted hover:border-border-strong"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">Super Admin</span>
                <span className="font-mono text-xs text-foreground-muted/80">admin@demo.realhub.local</span>
              </div>
              <span className="font-mono text-xs text-foreground-muted/80">Admin@123456</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("sales@demo.realhub.local", "Sales@123456")}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface-muted/40 px-4 py-3 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-muted hover:border-border-strong"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">Sales</span>
                <span className="font-mono text-xs text-foreground-muted/80">sales@demo.realhub.local</span>
              </div>
              <span className="font-mono text-xs text-foreground-muted/80">Sales@123456</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/register"
          className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <span>Chua co tai khoan? Dang ky</span>
          <span className="inline-flex size-6 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={12} />
          </span>
        </a>
      </div>
    </div>
  );
}
