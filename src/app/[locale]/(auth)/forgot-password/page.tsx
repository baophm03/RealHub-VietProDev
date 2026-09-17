"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "../_components/auth-card";

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
    <AuthCard
      title="Quên mật khẩu"
      subtitle="Nhập email đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu"
      className="max-w-md"
    >
      {sent ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 rounded-xl border border-accent-green/40 bg-accent-green/30 px-4 py-3.5">
            <MailCheck size={18} className="mt-0.5 shrink-0 text-accent-green-text" />
            <div className="text-sm leading-relaxed text-accent-green-text">
              Vui lòng kiểm tra hộp thư của bạn để đặt lại mật khẩu.
            </div>
          </div>
          <Link href="/login">
            <Button variant="secondary" className="w-full" size="lg">
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-1 w-full" size="lg">
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          <span>Quay lại đăng nhập</span>
        </Link>
      </div>
    </AuthCard>
  );
}
