import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale, getMessages } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = "https://realhub.vn";
  const localeUrl = `${siteUrl}/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "RealHub — Nền tảng bất động sản",
      template: "%s — RealHub",
    },
    description:
      "Hệ thống quản lý bất động sản đa tenant cho Agency, Developer, Distributor",
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: "RealHub",
      url: localeUrl,
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: localeUrl,
      languages: {
        vi: `${siteUrl}/vi`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/vi`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
