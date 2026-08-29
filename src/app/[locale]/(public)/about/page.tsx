"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Eye,
  Handshake,
  LineChart,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RevealSection } from "@/components/shared/reveal-section";
import { PageBanner } from "@/components/shared/page-banner";
import { cn } from "@/lib/utils";

const milestones = [
  { year: "2023", title: "Khởi đầu", desc: "Ý tưởng RealHub ra đời từ nhu cầu số hóa ngành bất động sản." },
  { year: "2024", title: "Ra mắt MVP", desc: "Phát hành phiên bản đầu tiên với 5 module cốt lõi." },
  { year: "2025", title: "Mở rộng", desc: "Hơn 45+ agency tin dùng, phủ sóng toàn quốc." },
  { year: "2026", title: "Vươn tầm", desc: "Mục tiêu trở thành nền tảng BĐS số 1 Đông Nam Á." },
];

const values = [
  { icon: Users, title: "Con người là trọng tâm", desc: "Mỗi tính năng đều được thiết kế cho người dùng — từ khách hàng đến sales, từ owner đến admin." },
  { icon: Handshake, title: "Minh bạch & Tin cậy", desc: "Mọi giao dịch, hoa hồng, phân bổ lead đều có audit log rõ ràng, không mập mờ." },
  { icon: Shield, title: "Bảo mật & An toàn", desc: "Dữ liệu đa tenant được cách ly chặt chẽ, phân quyền chi tiết đến từng vai trò." },
  { icon: Zap, title: "Hiệu suất cao", desc: "Hệ thống tối ưu cho thao tác nhanh, tải trang tức thì, đồng bộ thời gian thực." },
  { icon: Sparkles, title: "Trải nghiệm tinh tế", desc: "Giao diện Editorial Luxury — đẹp, dễ dùng, chuyên nghiệp trên mọi thiết bị." },
  { icon: LineChart, title: "Phát triển bền vững", desc: "Kiến trúc mở, dễ tích hợp, sẵn sàng mở rộng quy mô và tính năng mới." },
];

const stats = [
  { value: "45+", label: "Agency tin dùng", icon: Building2 },
  { value: "10K+", label: "Giao dịch thành công", icon: Handshake },
  { value: "50K+", label: "Khách hàng kết nối", icon: Users },
  { value: "99.9%", label: "Uptime đảm bảo", icon: LineChart },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="Nền tảng kết nối"
        description="RealHub - trung tâm kết nối giữa khách hàng và chủ đầu tư."
        backgroundImage="/background/about.jpg"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Về chúng tôi" }]}
      />

      {/* Stats Bar — giống home nhưng nội dung khác */}
      <section className="border-y border-border bg-[#F9FAFB] py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className={cn(
                  "group flex cursor-pointer flex-col items-center gap-3 rounded-2xl px-6 py-6 text-center transition-colors duration-300 hover:bg-surface md:px-10 md:py-8",
                  i > 0 && "md:border-l md:border-border",
                  i === 2 && "border-t border-border md:border-t-0",
                  i === 3 && "border-t border-border md:border-t-0",
                  i < 2 && "border-r border-border md:border-r-0",
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:shadow-sm md:h-16 md:w-16"
                >
                  <item.icon size={32} className="text-primary transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
                </motion.div>
                <span className="font-serif text-3xl font-semibold tabular-nums tracking-tighter md:text-4xl">
                  {item.value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sứ mệnh & Tầm nhìn */}
      <div className="container py-16 md:py-24">
        <RevealSection className="mb-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-8 transition-shadow hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Target size={24} className="text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-semibold">Sứ mệnh</h2>
              <p className="text-base leading-relaxed text-foreground-muted">
                Democratize công nghệ bất động sản — giúp mọi agency, từ nhỏ đến lớn,
                vận hành chuyên nghiệp với công cụ mạnh mẽ nhưng dễ sử dụng.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-8 transition-shadow hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Eye size={24} className="text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-semibold">Tầm nhìn</h2>
              <p className="text-base leading-relaxed text-foreground-muted">
                Trở thành nền tảng bất động sản số 1 Đông Nam Á,
                nơi mọi giao dịch đều minh bạch, hiệu quả và dễ dàng.
              </p>
            </div>
          </div>
        </RevealSection>

        {/* Giá trị cốt lõi — grid 3 cột giống home */}
        <RevealSection className="mb-20">
          <div>
            <div className="mb-8 flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">Giá trị cốt lõi</span>
              <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                Những nguyên tắc định hình RealHub
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <v.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Hành trình phát triển — timeline */}
        <RevealSection className="mb-20">
          <div>
            <div className="mb-8 flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">Hành trình</span>
              <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                Cột mốc phát triển
              </h2>
            </div>
            <div className="relative grid gap-6 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface font-serif text-sm font-semibold text-primary">
                      {m.year}
                    </div>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-semibold">{m.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA section — giống home */}
        <RevealSection>
          <section className="bg-[#0B2A0B] py-16 md:py-24 rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center gap-8 px-6 text-center md:px-8"
            >
              <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                Tham gia cùng chúng tôi
              </span>

              <h2 className="max-w-[20ch] font-serif text-3xl font-semibold leading-[1.1] tracking-tighter text-balance text-white md:text-5xl">
                Trở thành một phần của hệ sinh thái RealHub
              </h2>

              <p className="max-w-[44ch] text-base leading-relaxed text-white/60">
                Kết nối sản phẩm, khách hàng và giao dịch của bạn trên một nền tảng duy nhất.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-[#C7EDBB] text-[#1E2220] hover:bg-[#C7EDBB]/90"
                  render={<Link href="/register" />}
                  rightIcon={
                    <span className="flex items-center justify-center">
                      <ArrowRight size={14} />
                    </span>
                  }
                >
                  Tham gia ngay
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-[#1E2220] hover:bg-white/90"
                  render={<Link href="/contact" />}
                >
                  Liên hệ tư vấn
                </Button>
              </div>
            </motion.div>
          </section>
        </RevealSection>
      </div>
    </>
  );
}
