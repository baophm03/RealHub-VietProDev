import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "./_components/contact-form";
import { RevealSection } from "@/components/shared/reveal-section";
import { PageBanner } from "@/components/shared/page-banner";
import { generateSeoMetadata } from "@/lib/seo";
import { buildStaticContext } from "@/lib/seo-context";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("public.contact");
  return generateSeoMetadata("CONTACT", buildStaticContext(), {
    title: t("metaTitle"),
    description: t("metaDesc"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("public.contact");
  const tc = await getTranslations("public.common");
  const tp = await getTranslations("public");

  return (
    <>
      <PageBanner
        title={t("bannerTitle")}
        description={t("bannerDesc")}
        backgroundImage="/background/contact.jpg"
        breadcrumbs={[{ label: tc("home"), href: "/" }, { label: tp("nav.contact") }]}
      />

      <div className="container py-16 md:py-24">

        <RevealSection>
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8 shadow-[0_24px_70px_-24px_rgba(45,95,63,0.14)]">
              <div className="flex items-start gap-4">
                <Send size={24} className="mt-1 shrink-0 text-blue-600" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-serif text-2xl font-semibold tracking-tight">{t("sendMessage")}</h2>
                  <p className="text-sm text-foreground-muted">{t("sendMessageDesc")}</p>
                </div>
              </div>
              <ContactForm />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">{t("contactInfo")}</h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+842812345678"
                    className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors duration-300 hover:bg-surface-muted/60"
                  >
                    <Phone size={20} className="shrink-0 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">{t("phone")}</span>
                      <span className="text-sm font-medium">+84 (0) 28 1234 5678</span>
                    </div>
                  </a>
                  <a
                    href="mailto:contact@realhub.vn"
                    className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors duration-300 hover:bg-surface-muted/60"
                  >
                    <Mail size={20} className="shrink-0 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">{t("email")}</span>
                      <span className="text-sm font-medium">contact@realhub.vn</span>
                    </div>
                  </a>
                  <div className="group flex items-center gap-3 rounded-xl p-2 -m-2">
                    <MapPin size={20} className="shrink-0 text-rose-600" />
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">{t("office")}</span>
                      <span className="text-sm font-medium">Tầng 8, Sunwah Tower, Quận 1, TP.HCM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="shrink-0 text-amber-600" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">{t("workingHours")}</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-muted">{t("workingHoursWeekday")}</span>
                    <span className="font-medium tabular-nums">{t("workingHoursWeekdayTime")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-muted">{t("workingHoursSaturday")}</span>
                    <span className="font-medium tabular-nums">{t("workingHoursSaturdayTime")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-muted">{t("workingHoursSunday")}</span>
                    <span className="font-medium text-foreground-muted">{t("workingHoursSundayTime")}</span>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-border">
                <div
                  className="flex h-52 items-center justify-center bg-surface-muted"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                >
                  <div className="relative flex flex-col items-center gap-2">
                    <span className="absolute -top-1 size-12 animate-ping rounded-full bg-rose-500/20" />
                    <div className="relative flex size-12 items-center justify-center rounded-full bg-rose-500 shadow-lg">
                      <MapPin size={22} className="text-white" />
                    </div>
                    <span className="mt-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium shadow-sm">
                      Sunwah Tower, Quận 1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </>
  );
}
