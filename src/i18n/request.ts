import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Deep-merge source objects into a target object. Arrays and primitives are
 * overwritten; plain objects are merged recursively. Used to combine the
 * namespace message files into a single message tree.
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Record<string, unknown>[]
): T {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const targetValue = (target as Record<string, unknown>)[key];
      const sourceValue = source[key];
      if (
        targetValue &&
        sourceValue &&
        typeof targetValue === "object" &&
        typeof sourceValue === "object" &&
        !Array.isArray(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        (target as Record<string, unknown>)[key] = deepMerge(
          { ...(targetValue as Record<string, unknown>) },
          sourceValue as Record<string, unknown>,
        );
      } else {
        (target as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }
  return target;
}

// Top-level namespace files: messages/{ns}-{locale}.json
const topNamespaces = [
  "appointments",
  "auth",
  "commission",
  "common",
  "customers",
  "dashboard",
  "deals",
  "errors",
  "leads",
  "nav",
  "properties",
  "settings",
  "validation",
] as const;

// Public sub-namespace files: messages/public-{ns}-{locale}.json
// "index" is special: its flat keys are merged directly into the "public"
// namespace rather than being nested under a sub-namespace key.
const publicNamespaces = [
  "about",
  "common",
  "contact",
  "enums",
  "footer",
  "header",
  "home",
  "index",
  "listingDetail",
  "listings",
  "nav",
  "news",
  "projectDetail",
  "projects",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const sources: Record<string, unknown>[] = [];

  // Load top-level namespace files — each file becomes a top-level key.
  for (const ns of topNamespaces) {
    try {
      const mod = await import(`./messages/${ns}-${locale}.json`);
      sources.push({ [ns]: mod.default });
    } catch {
      // Namespace file is optional; skip if missing.
    }
  }

  // Load public sub-namespace files and combine into a single "public" key.
  // "index" provides flat keys; other files are nested under their filename.
  const publicMessages: Record<string, unknown> = {};
  for (const ns of publicNamespaces) {
    try {
      const mod = await import(`./messages/public-${ns}-${locale}.json`);
      if (ns === "index") {
        Object.assign(publicMessages, mod.default);
      } else {
        publicMessages[ns] = mod.default;
      }
    } catch {
      // Public sub-namespace file is optional; skip if missing.
    }
  }
  sources.push({ public: publicMessages });

  return {
    locale,
    messages: deepMerge({}, ...sources),
  };
});
