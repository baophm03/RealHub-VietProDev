import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
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
            <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-8">
              <h2 className="font-serif text-xl font-semibold">{t("sendMessage")}</h2>
              <ContactForm />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide">{t("contactInfo")}</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">{t("phone")}</span>
                      <span className="text-sm font-medium">+84 (0) 28 1234 5678</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">{t("email")}</span>
                      <span className="text-sm font-medium">contact@realhub.vn</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground-muted">{t("office")}</span>
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
    </>
  );
}
