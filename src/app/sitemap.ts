import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import config from '@/config'
const BASE_URLS: Record<string, string> = {
  vi: config.siteUrl,
  en: `${config.siteUrl}/en`,
};

const STATIC_ROUTES = [
  "",
  "/listings",
  "/about",
  "/contact",
  "/projects",
  "/news",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const base = BASE_URLS[locale] ?? `${config.siteUrl}/${locale}`;

    for (const route of STATIC_ROUTES) {
      const alternates: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        alternates[altLocale] = `${BASE_URLS[altLocale]}${route}`;
      }

      entries.push({
        url: `${base}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
