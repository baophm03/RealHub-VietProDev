import type { Metadata } from "next";
import { getApiResolveSeoMeta } from "@/lib/api/endpoints/seo-templates";

export type SeoPageType =
  | "HOME"
  | "PROPERTY_LISTING"
  | "PROPERTY_DETAIL"
  | "BLOG_LIST"
  | "BLOG_DETAIL"
  | "ABOUT"
  | "CONTACT";

export type SeoContext = Record<string, string>;

interface RawSeoTemplate {
  pageType: string;
  titleTemplate: string;
  descriptionTemplate: string;
  ogTitleTemplate: string | null;
  ogDescriptionTemplate: string | null;
  canonicalRuleJson: any;
  robotsRule: string;
}

interface ResolveApiResponse {
  success?: boolean;
  data?: RawSeoTemplate | null;
  message?: string;
}

function render(tmpl: string, ctx: SeoContext): string {
  return tmpl.replace(/\{\{(\w+)\}\}/g, (_, key: string) => ctx[key] ?? "");
}

export async function generateSeoMetadata(
  pageType: SeoPageType,
  context: SeoContext = {},
  fallback: Metadata = {},
): Promise<Metadata> {
  let template: RawSeoTemplate | null = null;

  try {
    const res = (await getApiResolveSeoMeta({ pageType } as any)) as unknown as ResolveApiResponse;

    if (res && !(res as any).message) {
      template = (res.data ?? (res as any)) as RawSeoTemplate | null;
      if (template && !template.titleTemplate) template = null;
    }
  } catch {
    template = null;
  }

  if (!template) {
    return {
      ...fallback,
      openGraph: {
        ...(fallback.openGraph as any),
        siteName: "RealHub",
        locale: "vi_VN",
      },
    };
  }

  const title = render(template.titleTemplate, context);
  const description = render(template.descriptionTemplate, context);

  const ogTitle = template.ogTitleTemplate
    ? render(template.ogTitleTemplate, context)
    : null;
  const ogDescription = template.ogDescriptionTemplate
    ? render(template.ogDescriptionTemplate, context)
    : null;

  const robotsParts = (template.robotsRule || "index,follow")
    .split(",")
    .map((s) => s.trim().toLowerCase());

  const metadata: Metadata = {
    ...fallback,
    title: title || (fallback.title as string),
    description: description || (fallback.description as string),
    openGraph: {
      ...(fallback.openGraph as any),
      title: ogTitle || title || (fallback.title as string),
      description: ogDescription || description || (fallback.description as string),
      siteName: "RealHub",
      locale: "vi_VN",
      type: "website",
    },
    robots: {
      index: !robotsParts.includes("noindex"),
      follow: !robotsParts.includes("nofollow"),
    },
  };

  if (template.canonicalRuleJson && typeof template.canonicalRuleJson === "string") {
    metadata.alternates = {
      ...(metadata.alternates as any),
      canonical: template.canonicalRuleJson,
    };
  }

  return metadata;
}
