"use client";

import { useState } from "react";
import { Send, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostApiPropertyContacts } from "@/lib/api/endpoints/property-contacts";

const sellingModeLabel: Record<string, string> = {
  SALES_DISTRIBUTION: "Phân phối sales",
  SELF_SELL: "Tự bán",
  HYBRID: "Kết hợp",
  AGENCY_DISTRIBUTION: "Sàn công khai",
  INTERNAL_ONLY: "Nội bộ",
};

interface ContactInfo {
  name?: string | null;
  phone?: string | null;
  position?: string | null;
}

interface ListingContactSidebarProps {
  propertyId: string;
  contacts?: ContactInfo[];
  propertyTypeName?: string | null;
  direction?: string | null;
  sellingMode?: string | null;
  createdAt?: string | null;
}

export function ListingContactSidebar({
  propertyId,
  contacts = [],
  propertyTypeName,
  direction,
  sellingMode,
  createdAt,
}: ListingContactSidebarProps) {
  const { mutateAsync: submitContact, isPending } = usePostApiPropertyContacts();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    try {
      await submitContact({
        data: {
          propertyId,
          userName: form.name.trim(),
          userPhone: form.phone.trim(),
          userContent: form.message.trim() || undefined,
        },
      });
      toast.success("Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ với bạn sớm.");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
      console.error(err);
    }
  };

  return (
    <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-6">
        {/* Agent Info */}
        {contacts.map((item) => (
          <div key={item.name ?? item.phone} className="flex flex-col gap-3 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="size-16 overflow-hidden rounded-lg border border-primary/20">
                <img
                  src="/avatar-fallback.png"
                  alt={item.name ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-lg font-bold text-primary">{item.name || "Chưa có thông tin"}</h3>
                <p className="text-sm text-foreground-muted">{item.position || "Chưa có vị trí"}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Contact Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full h-10 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Input
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full h-10 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Textarea
            placeholder="Nội dung yêu cầu"
            rows={3}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button type="submit" className="w-full" size="lg" disabled={isPending} leftIcon={<Send size={16} />}>
            {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
          {contacts.map((item) => (
            <div key={item.name ?? item.phone} className="flex flex-col gap-3 pb-6 border-b border-border">
              {item.phone && (
                <Button type="button" variant="outline" className="w-full" leftIcon={<Phone size={16} />}>
                  {item.phone}
                </Button>
              )}
            </div>
          ))}
        </form>

        {/* Property Meta */}
        <div className="border-t border-border pt-4 space-y-2 text-xs text-foreground-muted">
          <div className="flex justify-between">
            <span>Thể loại</span>
            <span className="font-medium text-foreground">{propertyTypeName ?? "—"}</span>
          </div>
          {direction && (
            <div className="flex justify-between">
              <span>Hướng</span>
              <span className="font-medium text-foreground">{direction}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Hình thức</span>
            <span className="font-medium text-foreground">
              {sellingModeLabel[sellingMode ?? ""] ?? sellingMode ?? "—"}
            </span>
          </div>
          {createdAt && (
            <div className="flex justify-between">
              <span>Ngày đăng</span>
              <span className="font-medium text-foreground">
                {new Date(createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
