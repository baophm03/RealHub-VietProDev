import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./_components/contact-form";
import { RevealSection } from "@/components/shared/reveal-section";
import { PageBanner } from "@/components/shared/page-banner";
import { generateSeoMetadata } from "@/lib/seo";
import { buildStaticContext } from "@/lib/seo-context";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata("CONTACT", buildStaticContext(), {
    title: "Liên hệ - RealHub",
    description: "Liên hệ với RealHub để được hỗ trợ nhanh nhất.",
  });
}

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Liên hệ ngay"
        description="Đăng ký tư vấn hoặc liên hệ ngay với chúng tôi để được hỗ trợ nhanh nhất."
        backgroundImage="/background/contact.jpg"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
      />

      <div className="container py-16 md:py-24">

        <RevealSection>
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-8">
              <h2 className="font-serif text-xl font-semibold">Gửi tin nhắn</h2>
              <ContactForm />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide">Thông tin liên hệ</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">Điện thoại</span>
                      <span className="text-sm font-medium">+84 (0) 28 1234 5678</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">Email</span>
                      <span className="text-sm font-medium">contact@realhub.vn</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">Văn phòng</span>
                      <span className="text-sm font-medium">Tầng 8, Sunwah Tower, Quận 1, TP.HCM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <div className="flex h-48 items-center justify-center bg-surface-muted">
                  <MapPin size={32} className="text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </>
  );
}
