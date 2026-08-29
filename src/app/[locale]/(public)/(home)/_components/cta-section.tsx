"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-[#0B2A0B] py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center gap-8 px-6 text-center md:px-8"
      >
        <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
          Bắt đầu ngay
        </span>

        <h2 className="max-w-[20ch] font-serif text-3xl font-semibold leading-[1.1] tracking-tighter text-balance text-white md:text-5xl">
          Kết nối bất động sản của bạn với hệ sinh thái RealHub
        </h2>

        <p className="max-w-[44ch] text-base leading-relaxed text-white/60">
          Đăng ký miễn phí để bắt đầu quản lý sản phẩm, khách hàng và giao dịch
          trên một nền tảng duy nhất.
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
  );
}
