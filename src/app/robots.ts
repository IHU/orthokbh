import type { MetadataRoute } from "next";
import { buildCanonicalUrl, DEFAULT_SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = buildCanonicalUrl("sitemap.xml");

  let host: string | undefined;

  try {
    host = new URL(DEFAULT_SITE_URL).host;
  } catch {
    host = undefined;
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: sitemapUrl ? [sitemapUrl] : undefined,
    host,
  };
}
