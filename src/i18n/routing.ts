import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
  localeDetection: false,
  domains: [
    {
      domain: "realhub.vn",
      defaultLocale: "vi",
      locales: ["vi"],
    },
    {
      domain: "en.realhub.vn",
      defaultLocale: "en",
      locales: ["en"],
    },
  ],
});
