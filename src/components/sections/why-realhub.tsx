"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";

const features = [
  {
    number: "01",
    title: "Commission Engine động",
    description:
      "Tính hoa hồng theo rule, split và snapshot — không fix cứng. Mỗi deal áp dụng rule tại thời điểm tạo.",
  },
  {
    number: "02",
    title: "Lead Protection",
    description:
      "Bảo vệ quyền xử lý lead theo nguồn. Tự động kiểm tra trùng lặp và cảnh báo tranh chấp.",
  },
  {
    number: "03",
    title: "Dynamic Forms",
    description:
      "Form bất động sản linh hoạt theo loại: căn hộ, đất, văn phòng, kho xưởng. Render động từ API.",
  },
  {
    number: "04",
    title: "Multi-tenant",
    description:
      "Mỗi agency một không gian riêng. Tenant header, role, permission và feature flags độc lập.",
  },
];

export function WhyRealHub() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-[1400px] items-start gap-20 px-6 md:px-8 lg:grid-cols-2 lg:gap-28 lg:px-12">
        {/* Left — sticky image with Double-Bezel overlay */}
        <motion.div
          initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:sticky lg:top-32"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] ring-1 ring-black/5">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://picsum.photos/seed/realhub-why-architecture/800/1000)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          </div>

          {/* Floating stat card — Double-Bezel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-8 -right-8 hidden rounded-[1.25rem] bg-surface-muted p-1.5 ring-1 ring-border lg:block"
          >
            <div className="flex flex-col gap-1 rounded-[calc(1.25rem-0.375rem)] bg-surface p-6">
              <span className="font-serif text-4xl font-semibold tabular-nums tracking-tighter text-primary">
                97.2%
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-muted">
                Khách hàng hài lòng
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — numbered features */}
        <motion.div
          initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
              Tại sao chọn RealHub
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
              Không chỉ là website đăng tin
            </h2>
            <p className="max-w-[44ch] text-base leading-relaxed text-foreground-muted">
              RealHub là hệ sinh thái kết nối toàn vòng đời: sản phẩm → khách
              hàng → lịch hẹn → giao dịch → hoa hồng.
            </p>
          </div>

          <div className="flex flex-col">
            {features.map((feature, i) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-start gap-8 border-t border-border py-8 transition-colors duration-500 hover:bg-surface-muted/30"
              >
                <span className="font-mono text-sm font-semibold tabular-nums text-primary/50 transition-colors duration-500 group-hover:text-primary">
                  {feature.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold tracking-tight">{feature.title}</h3>
                  <p className="max-w-[42ch] text-sm leading-relaxed text-foreground-muted">
                    {feature.description}
                  </p>
                </div>
                <CheckCircle
                  size={20}
                  weight="duotone"
                  className="ml-auto mt-0.5 shrink-0 text-primary/30 transition-colors duration-500 group-hover:text-primary"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
