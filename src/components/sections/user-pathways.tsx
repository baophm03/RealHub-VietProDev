"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@phosphor-icons/react";

const pathways = [
  {
    label: "Khách hàng",
    title: "Tìm & so sánh bất động sản",
    description:
      "Tìm kiếm theo khu vực, giá, diện tích. Lưu, so sánh và gửi nhu cầu. Đặt lịch xem nhà trực tiếp.",
    cta: "Tìm bất động sản",
    href: "/listings",
    image: "https://picsum.photos/seed/realhub-customer-pathway/900/700",
  },
  {
    label: "Chủ BĐS",
    title: "Đăng & tự bán",
    description:
      "Đăng sản phẩm, chọn hình thức bán. Nhận lead trực tiếp, quản lý giao dịch.",
    cta: "Đăng ký",
    href: "/register",
    image: "https://picsum.photos/seed/realhub-owner-pathway/600/400",
  },
  {
    label: "Sales / Agency",
    title: "Quản lý & chốt deal",
    description:
      "Nhận phụ trách, chia sẻ link tiếp thị. Quản lý lead, deal và hoa hồng tự động.",
    cta: "Đăng nhập",
    href: "/login",
    image: "https://picsum.photos/seed/realhub-sales-pathway/600/400",
  },
];

export function UserPathways() {
  const [customer, owner, sales] = pathways;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-4">
          <span className="w-fit rounded-full bg-primary/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            Dành cho bạn
          </span>
          <h2 className="font-serif text-3xl font-semibold tracking-tighter md:text-5xl">
            Một nền tảng, ba vai trò
          </h2>
        </div>

        {/* Asymmetric bento — large card left, two stacked right */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Large featured card — Customer */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={customer.href}
              className="group/pathway relative flex h-full min-h-[480px] flex-col justify-end overflow-hidden rounded-[1.5rem] ring-1 ring-black/5"
            >
              {/* Background image — clearly visible */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pathway:scale-105"
                style={{ backgroundImage: `url(${customer.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Label badge top-left */}
              <div className="absolute top-6 left-6 z-10">
                <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary backdrop-blur-sm">
                  {customer.label}
                </span>
              </div>

              {/* Content bottom */}
              <div className="relative z-10 flex flex-col gap-4 p-8 md:p-10">
                <h3 className="font-serif text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {customer.title}
                </h3>
                <p className="max-w-[42ch] text-sm leading-relaxed text-white/70">
                  {customer.description}
                </p>
                <div className="mt-2 flex items-center gap-2.5 text-sm font-medium text-white">
                  {customer.cta}
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pathway:translate-x-1">
                    <ArrowRight size={12} weight="bold" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Two stacked cards — Owner + Sales */}
          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-1">
            {[owner, sales].map((pathway, i) => (
              <motion.div
                key={pathway.label}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i + 1) * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={pathway.href}
                  className="group/pathway relative flex h-full min-h-[230px] flex-col justify-between overflow-hidden rounded-[1.5rem] ring-1 ring-black/5"
                >
                  {/* Background image — visible but subtle */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pathway:scale-105"
                    style={{ backgroundImage: `url(${pathway.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

                  {/* Label badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary backdrop-blur-sm">
                      {pathway.label}
                    </span>
                  </div>

                  {/* Content bottom */}
                  <div className="relative z-10 flex items-center justify-between gap-4 p-6 md:pt-20">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-serif text-lg font-semibold tracking-tight text-white md:text-xl">
                        {pathway.title}
                      </h3>
                      <p className="max-w-[36ch] text-xs leading-relaxed text-white/65">
                        {pathway.description}
                      </p>
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pathway:translate-x-1">
                      <ArrowRight size={12} weight="bold" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
