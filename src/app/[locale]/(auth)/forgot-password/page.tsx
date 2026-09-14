"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Quên mật khẩu</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Nhập email để tiếp tục
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-md bg-accent-green/10 px-4 py-3 text-sm text-accent-green-text">
              Vui lòng kiểm tra hộp thư của bạn.
            </div>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="an.nguyen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground"
        >
          <ArrowLeft size={14} />
          <span>Quay lại đăng nhập</span>
        </Link>
      </div>
    </div>
  );
}
