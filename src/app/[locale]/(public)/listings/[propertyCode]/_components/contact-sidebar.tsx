"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Phone, CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostApiPropertyContacts, usePostApiPropertyContactsConsultation } from "@/lib/api/endpoints/property-contacts";
import { useGetApiAssignmentByPublicLink } from "@/lib/api/endpoints/assignments";
import { useAuthStore } from "@/lib/stores/auth-store";

const sellingModeLabel: Record<string, string> = {
  SALES_DISTRIBUTION: "Phân phối sales",
  SELF_SELL: "Tự bán",
  HYBRID: "Kết hợp",
  AGENCY_DISTRIBUTION: "Sàn công khai",
  INTERNAL_ONLY: "Nội bộ",
};

interface ContactInfo {
  id?: string | null;
  name?: string | null;
  phone?: string | null;
  position?: string | null;
}

interface ContactSidebarProps {
  property?: any;
  direction?: string | null;
}

export function ContactSidebar(props: ContactSidebarProps) {
  return (
    <Suspense fallback={<ContactSidebarInner {...props} />}>
      <ContactSidebarInner {...props} />
    </Suspense>
  );
}

function ContactSidebarInner({
  property,
  direction,
}: ContactSidebarProps) {
  const { mutateAsync: submitContact, isPending } = usePostApiPropertyContacts();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const { data: assignmentData } = useGetApiAssignmentByPublicLink(refCode ?? "", {
    query: { enabled: !!refCode },
  });

  const refAssignment = (assignmentData as any)?.data ?? assignmentData;
  const refAssignedUser = refAssignment?.assignedUser;

  const activeAssignment = property?.assignments?.find((a: any) => a.status === "ACTIVE");
  const assignedUser = refAssignedUser ?? activeAssignment?.assignedUser;
  const owner = property?.owner;

  // Fallback chain: ref assignment → active assigned sales → owner → RealHub support
  const contacts: ContactInfo[] = assignedUser && (assignedUser.fullName || assignedUser.phone)
    ? [{
      id: assignedUser.id ?? null,
      name: assignedUser.fullName ?? null,
      phone: assignedUser.phone ?? null,
      position: "Nhân viên kinh doanh",
    }]
    : owner && (owner.fullName || owner.phone)
      ? [{
        id: owner.id ?? null,
        name: owner.fullName ?? null,
        phone: owner.phone ?? null,
        position: "Chủ bất động sản",
      }]
      : [{
        id: null,
        name: "Liên hệ RealHub",
        phone: null,
        position: "Nhân viên hỗ trợ",
      }];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    try {
      const recipientUserId = contacts.find((c) => c.id)?.id ?? "";
      await submitContact({
        data: {
          propertyId: property?.id,
          recipientUserId: recipientUserId || (undefined as any),
          userName: form.name.trim(),
          userPhone: form.phone.trim(),
          userContent: form.message.trim() || undefined,
        },
      });
      toast.success("Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
      console.error(err);
    }
  };

  const consultationMutation = usePostApiPropertyContactsConsultation();

  const handleBookConsultation = async () => {
    const recipientUserId = contacts.find((c) => c.id)?.id ?? undefined;
    try {
      const result: any = await consultationMutation.mutateAsync({
        data: { propertyId: property?.id, recipientUserId } as any,
      });
      const isDuplicate = result?.data?.duplicate ?? result?.duplicate;
      if (isDuplicate) {
        toast.info("Bạn đã đăng ký tư vấn bất động sản này rồi. Sales sẽ liên hệ sớm.");
      } else {
        toast.success("Đã đăng ký tư vấn. Sales sẽ liên hệ với bạn sớm.");
      }
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Đăng ký tư vấn thất bại. Vui lòng thử lại.");
      console.error(err);
    }
  };

  return (
    <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6 space-y-6">
        {/* Agent Info */}
        {contacts.map((item) => (
          <div key={`${item.id ?? item.name ?? item.phone ?? "contact"}`} className="flex flex-col gap-3 pb-6 border-b border-border">
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

        {/* Contact Form / Consultation Booking */}
        <div className="space-y-3">
          {isAuthenticated ? (
            <Button
              type="button"
              className="w-full"
              size="lg"
              leftIcon={consultationMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
              onClick={handleBookConsultation}
              disabled={consultationMutation.isPending}
            >
              {consultationMutation.isPending ? "Đang gửi..." : "Tư vấn ngay"}
            </Button>
          ) : (
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
            </form>
          )}
          {contacts.map((item) => (
            <div key={`${item.id ?? item.name ?? item.phone ?? "phone"}`} className="flex flex-col gap-3">
              {item.phone && (
                <Button type="button" variant="outline" className="w-full" leftIcon={<Phone size={16} />} render={<a href={`tel:${item.phone}`} />}>
                  {item.phone}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Property Meta */}
        <div className="border-t border-border pt-4 space-y-2 text-xs text-foreground-muted">
          <div className="flex justify-between">
            <span>Thể loại</span>
            <span className="font-medium text-foreground">{property?.propertyType?.name ?? "—"}</span>
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
              {sellingModeLabel[property?.sellingMode ?? ""] ?? property?.sellingMode ?? "—"}
            </span>
          </div>
          {property?.createdAt && (
            <div className="flex justify-between">
              <span>Ngày đăng</span>
              <span className="font-medium text-foreground">
                {new Date(property.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
