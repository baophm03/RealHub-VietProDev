import type { MetadataRoute } from "next";
import config from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/properties/*/edit",
          "/properties/new",
          "/projects/*/edit",
          "/projects/new",
          "/customers",
          "/leads",
          "/appointments",
          "/deals",
          "/commission",
          "/files",
          "/profile",
          "/settings",
          "/login",
          "/register",
          "/forgot-password",
        ],
      },
    ],
    sitemap: [`${config.siteUrl}/sitemap.xml`],
  };
}
