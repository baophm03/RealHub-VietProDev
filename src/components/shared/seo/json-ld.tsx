import type { ReactNode } from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(locale: string) {
  return {
    "@type": "Organization",
    "@id": "https://realhub.vn/#organization",
    name: "RealHub",
    url: locale === "vi" ? "https://realhub.vn" : "https://en.realhub.vn",
    description:
      locale === "vi"
        ? "Nền tảng Bất động sản đa tenant cho Agency, Developer, Distributor"
        : "Multi-tenant Real Estate Platform for Agency, Developer, Distributor",
    areaServed: "VN",
  };
}

export function websiteJsonLd(locale: string) {
  return {
    "@type": "WebSite",
    "@id": "https://realhub.vn/#website",
    url: locale === "vi" ? "https://realhub.vn" : "https://en.realhub.vn",
    name: "RealHub",
    inLanguage: locale === "vi" ? "vi-VN" : "en-US",
    publisher: { "@id": "https://realhub.vn/#organization" },
  };
}

export function propertyJsonLd(property: {
  name: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  url: string;
}) {
  return {
    "@type": "Product",
    name: property.name,
    description: property.description,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
    image: property.images,
    url: property.url,
  };
}
