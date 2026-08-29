"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePostApiContactRequests } from "@/lib/api/endpoints/contact-requests";

export function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const { mutateAsync: submitContact, isPending } = usePostApiContactRequests({
    mutation: {
      onSuccess: () => {
        toast.success("Gửi tin nhắn thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất.");
        setForm({ fullName: "", email: "", phone: "", subject: "", message: "" });
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.error?.message?.[0] ||
          "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại."
        );
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    try {
      await submitContact({
        data: {
          fullName: form.fullName.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim() || undefined,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Họ tên</label>
          <input
            className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Email</label>
          <input
            className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Số điện thoại</label>
        <input
          className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
          placeholder="0901 234 567"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Chủ đề</label>
        <input
          className="h-11 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary transition-colors"
          placeholder="Tư vấn bất động sản"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Nội dung</label>
        <textarea
          rows={5}
          className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
          placeholder="Mô tả nhu cầu của bạn..."
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
      </div>
      <Button type="submit" size="lg" className="w-fit" disabled={isPending} leftIcon={isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}>
        {isPending ? "Đang gửi..." : "Gửi tin nhắn"}
      </Button>
    </form>
  );
}
