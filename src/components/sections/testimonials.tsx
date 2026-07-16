"use client";

import { motion } from "framer-motion";
import { Quotes } from "@phosphor-icons/react";

const testimonials = [
  {
    quote:
      "RealHub giúp team tôi quản lý 200+ bất động sản và tính hoa hồng chính xác cho từng deal. Tiết kiệm 80% thời gian so với Excel.",
    name: "Phạm Tuấn Kiệt",
    role: "Giám đốc",
    company: "Mekong Realty",
  },
  {
    quote:
      "Tôi đăng BĐS lên RealHub và nhận lead ngay trong ngày. Hệ thống tự động bảo vệ lead giúp tôi yên tâm chăm sóc khách.",
    name: "Đặng Thị Hồng Vân",
    role: "Chủ BĐS",
    company: "Saigon Holdings",
  },
  {
    quote:
      "Dynamic form theo loại BĐS là tính năng tôi thích nhất. Mỗi loại căn hộ, đất đều có field riêng — không còn form chung chung.",
    name: "Bùi Anh Khoa",
    role: "Sales Manager",
    company: "East Gate Properties",
  },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-surface-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-4">
          <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            Khách hàng nói gì
          </span>
          <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
            Được tin dùng bởi các agency
          </h2>
        </div>

        {/* Featured large quote — Double-Bezel */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="rounded-[2rem] bg-surface-muted p-1.5 ring-1 ring-border">
            <div className="flex flex-col gap-10 rounded-[calc(2rem-0.375rem)] bg-surface p-10 md:p-14">
              <Quotes size={44} weight="fill" className="text-primary/12" />
              <p className="max-w-[60ch] font-serif text-2xl italic leading-relaxed text-foreground md:text-3xl">
                &ldquo;{testimonials[0].quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 border-t border-border pt-8">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/8 text-lg font-semibold text-primary">
                  {testimonials[0].name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{testimonials[0].name}</span>
                  <span className="text-xs text-foreground-muted">
                    {testimonials[0].role} — {testimonials[0].company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two secondary quotes — Double-Bezel */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.slice(1).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[1.5rem] bg-surface-muted p-1.5 ring-1 ring-border"
            >
              <div className="flex flex-col gap-6 rounded-[calc(1.5rem-0.375rem)] bg-surface p-8 md:p-10">
                <p className="font-serif text-lg italic leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/8 text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{t.name}</span>
                    <span className="text-xs text-foreground-muted">
                      {t.role} — {t.company}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
