import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./_components/contact-form";
import { RevealSection } from "@/components/shared/reveal-section";

export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24 lg:px-12">
      <RevealSection>
        <div className="mb-12 flex flex-col gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Liên hệ
          </span>
          <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Chúng tôi ở đây để giúp bạn
          </h1>
          <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted">
            Đội ngũ RealHub sẵn sàng tư vấn giải pháp phù hợp cho agency, developer hoặc distributor của bạn.
          </p>
        </div>
      </RevealSection>

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
  );
}
