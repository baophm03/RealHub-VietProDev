import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { propertyCategories } from "@/config/property-categories";

export function PublicFooter() {
  const t = useTranslations("public");

  const footerLinks = [
    {
      title: "Bất động sản",
      links: propertyCategories.map((cat) => ({ label: cat.label, href: cat.href })),
    },
    {
      title: "Khám phá",
      links: [
        { label: "Dự án", href: "/projects" },
        { label: "Tin tức", href: "/news" },
        { label: t("about"), href: "/about" },
        { label: t("contact"), href: "/contact" },
      ],
    },
    {
      title: "Tài khoản",
      links: [
        { label: t("signIn"), href: "/login" },
        { label: t("signUp"), href: "/register" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-xl font-semibold tracking-tight">
              RealHub
            </span>
            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-foreground-muted">
              {t("tagline") === "tagline"
                ? "Nền tảng hệ sinh thái Bất động sản đa tenant cho Agency, Developer, Distributor."
                : t("tagline")}
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                {group.title}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="text-xs text-foreground-muted">
            © {new Date().getFullYear()} RealHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-xs text-foreground-muted transition-colors hover:text-foreground"
            >
              Điều khoản
            </Link>
            <Link
              href="/about"
              className="text-xs text-foreground-muted transition-colors hover:text-foreground"
            >
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
