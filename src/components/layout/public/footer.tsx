import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

export function PublicFooter() {
  const t = useTranslations("public");

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-2">
              <Building2 size={22} className="text-primary" />
              <p className="font-serif text-xl font-semibold tracking-tight">
                RealHub
              </p>
            </div>
            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-foreground-muted">
              {t("tagline") === "tagline"
                ? "Nền tảng bất động sản chuyên nghiệp hàng đầu Việt Nam. Cập nhật các thông tin dự án, bất động sản mới nhất, chính xác nhất cho khách hàng."
                : t("tagline")}
            </p>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Mua bán
            </p>
            <Link href="/listings?types=APARTMENT&transactionType=SALE" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Căn hộ
            </Link>
            <Link href="/listings?types=VILLA&transactionType=SALE" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Biệt thự
            </Link>
            <Link href="/listings?types=HOUSE,SHOPHOUSE&transactionType=SALE" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Nhà phố
            </Link>
            <Link href="/listings?types=LAND&transactionType=SALE" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Đất nền
            </Link>
            <Link href="/listings?types=OFFICE,WAREHOUSE,SHOP&transactionType=SALE" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Mặt bằng
            </Link>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Cho thuê
            </p>
            <Link href="/listings?types=APARTMENT&transactionType=RENT" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Căn hộ
            </Link>
            <Link href="/listings?types=VILLA&transactionType=RENT" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Biệt thự
            </Link>
            <Link href="/listings?types=HOUSE,SHOPHOUSE&transactionType=RENT" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Nhà phố
            </Link>
            <Link href="/listings?types=LAND&transactionType=RENT" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Đất nền
            </Link>
            <Link href="/listings?types=OFFICE,WAREHOUSE,SHOP&transactionType=RENT" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Mặt bằng
            </Link>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Khám phá
            </p>
            <Link href="/projects" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Dự án
            </Link>
            <Link href="/news/all" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              Tin tức
            </Link>
            <Link href="/about" className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              {t("about")}
            </Link>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Liên hệ
            </p>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <Phone size={14} className="shrink-0 text-primary" />
              <a href="tel:+84901234567" className="transition-colors hover:text-foreground tabular-nums">
                0901 234 567
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <Mail size={14} className="shrink-0 text-primary" />
              <a href="mailto:contact@realhub.vn" className="transition-colors hover:text-foreground">
                contact@realhub.vn
              </a>
            </div>
            <div className="flex items-start gap-2 text-sm text-foreground-muted">
              <MapPin size={14} className="shrink-0 text-primary mt-0.5" />
              <span className="leading-relaxed">
                123 Lê Lợi, Q.1, TP. HCM
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="text-sm text-foreground-muted">
            © {new Date().getFullYear()} RealHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Điều khoản
            </Link>
            <Link
              href="/about"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
