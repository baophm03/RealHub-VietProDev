"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "@phosphor-icons/react";

export function CtaSection() {
  return (
    <section className="px-6 py-32 md:px-8 md:py-40 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-[1400px] flex-col overflow-hidden rounded-[2rem] bg-primary ring-1 ring-primary/20 md:flex-row md:items-stretch"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/realhub-cta-architecture/1200/800)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, white 0%, transparent 35%), radial-gradient(circle at 85% 80%, white 0%, transparent 40%)",
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-8 px-10 py-16 text-primary-foreground md:px-16 md:py-24">
          <span className="w-fit rounded-full bg-primary-foreground/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
            Bắt đầu ngay
          </span>

          <h2 className="max-w-[16ch] font-serif text-3xl font-semibold leading-[1.1] tracking-tighter text-balance md:text-5xl">
            Kết nối bất động sản của bạn với hệ sinh thái RealHub
          </h2>

          <p className="max-w-[44ch] text-base leading-relaxed text-primary-foreground/60">
            Đăng ký miễn phí để bắt đầu quản lý sản phẩm, khách hàng và giao dịch
            trên một nền tảng duy nhất.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="secondary"
              size="lg"
              rightIcon={
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10">
                  <ArrowRight size={14} weight="bold" />
                </span>
              }
              render={<Link href="/register" />}
            >
              Đăng ký miễn phí
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/8"
              render={<Link href="/contact" />}
            >
              <Phone size={16} weight="regular" />
              Liên hệ tư vấn
            </Button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center gap-8 border-t border-primary-foreground/10 px-10 py-12 md:border-l md:border-t-0 md:px-14 md:py-24">
          <div className="flex flex-col gap-1.5">
            <span className="font-serif text-4xl font-semibold tabular-nums tracking-tighter text-primary-foreground">
              38
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground/50">
              Agency đang sử dụng
            </span>
          </div>
          <div className="h-px w-full bg-primary-foreground/10" />
          <div className="flex flex-col gap-1.5">
            <span className="font-serif text-4xl font-semibold tabular-nums tracking-tighter text-primary-foreground">
              1,847
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground/50">
              Giao dịch thành công
            </span>
          </div>
          <div className="h-px w-full bg-primary-foreground/10" />
          <div className="flex flex-col gap-1.5">
            <span className="font-serif text-4xl font-semibold tabular-nums tracking-tighter text-primary-foreground">
              97.2%
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground/50">
              Khách hàng hài lòng
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
