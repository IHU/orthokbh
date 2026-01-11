import type { Metadata } from "next";
import { buildUmbracoMediaUrl } from "./media";

const FALLBACK_SITE_URL = "http://localhost:3000";

function sanitizeSiteUrl(value?: string | null): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const withScheme = trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;

  return withScheme.replace(/\/+$/, "");
}

const envSiteUrl = sanitizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
const vercelSiteUrl = sanitizeSiteUrl(process.env.VERCEL_URL);

export const DEFAULT_SITE_URL = envSiteUrl || vercelSiteUrl || FALLBACK_SITE_URL;
export const DEFAULT_TITLE = "Uslu Solutions | Digital Consultancy | CMS, eCommerce & Enterprise Solutions";
export const DEFAULT_DESCRIPTION = "Expert digital consultancy specializing in Optimizely, Umbraco CMS, InRiver PIM, Microsoft 365, and enterprise integrations. We build scalable digital platforms that drive business growth. 20+ years experience.";

export function normalizeCanonicalPath(path?: string | null): string {
  if (!path) {
    return "/";
  }

  const trimmed = path.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withoutLeading = trimmed.replace(/^\/+/, "");
  const withoutTrailing = withoutLeading.replace(/\/+$/, "");

  if (!withoutTrailing) {
    return "/";
  }

  return `/${withoutTrailing.toLowerCase()}`;
}

export function buildCanonicalUrl(path: string = ""): string | undefined {
  if (!DEFAULT_SITE_URL) {
    return undefined;
  }

  const base = DEFAULT_SITE_URL.replace(/\/+$/, "");
  const normalizedPath = normalizeCanonicalPath(path);

  return `${base}${normalizedPath}`;
}

export function createMetadata(options: {
  title?: string | null;
  description?: string | null;
  canonicalPath?: string;
  type?: "website" | "article";
  siteName?: string;
  imageUrl?: string | null;
}): Metadata {
  const {
    title,
    description,
    canonicalPath = "",
    type = "website",
    siteName = DEFAULT_TITLE,
    imageUrl,
  } = options;

  const resolvedTitle = title?.trim() || DEFAULT_TITLE;
  const resolvedDescription = description?.trim() || DEFAULT_DESCRIPTION;
  const normalizedCanonicalPath = normalizeCanonicalPath(canonicalPath);
  const canonicalUrl = buildCanonicalUrl(normalizedCanonicalPath);
  const hasImage = typeof imageUrl === "string" && imageUrl.length > 0;
  const image = buildUmbracoMediaUrl(imageUrl ?? "");
  const openGraphImages = hasImage ? [{ url: image as string }] : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      type,
      siteName,
      images: openGraphImages,
    },
    twitter: {
      card: hasImage ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description: resolvedDescription,
      images: hasImage ? [image as string] : undefined,
    },
  };
}
