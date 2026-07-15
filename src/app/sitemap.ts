import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URLS: Record<string, string> = {
  vi: "https://realhub.vn",
  en: "https://en.realhub.vn",
};

const STATIC_ROUTES = [
  "",
  "/properties",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const base = BASE_URLS[locale] ?? `https://realhub.vn/${locale}`;

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
