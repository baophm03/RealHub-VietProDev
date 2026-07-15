"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
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
      <div className="mb-10 text-center">
        <span className="font-serif text-3xl font-semibold tracking-tight">
          RealHub
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Quen mat khau</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Nhap email de nhan huong dan dat lai mat khau
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-md bg-accent-green/10 px-4 py-3 text-sm text-accent-green-text">
              Da gui email huong dan. Vui long kiem tra hop thu cua ban.
            </div>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Quay lai dang nhap
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
              {loading ? "Dang gui..." : "Gui yeu cau"}
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
          <span>Quay lai dang nhap</span>
        </Link>
      </div>
    </div>
  );
}
