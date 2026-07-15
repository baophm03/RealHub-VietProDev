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
  const baseUrl = locale === "vi" ? "https://realhub.vn" : "https://en.realhub.vn";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "RealHub — Nền tảng Bất động sản",
      template: "%s — RealHub",
    },
    description:
      "Hệ thống quản lý bất động sản đa tenant cho Agency, Developer, Distributor",
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: "RealHub",
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        vi: "https://realhub.vn",
        en: "https://en.realhub.vn",
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
