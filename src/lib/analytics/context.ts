import type { AnalyticsPageContext } from "@/lib/analytics/schema";
import { buildCanonicalUrl, normalizeCanonicalPath } from "@/lib/metadata";
import type { ContentContentModel } from "@ihu/umbraco-components";

type ContentWithRoute = Pick<
  ContentContentModel,
  "id" | "name" | "contentType" | "route"
> & {
  route?: {
    path?: string | null;
    culture?: string | null;
  } | null;
};

interface BuildAnalyticsContextOptions {
  fallbackPath?: string;
  overrideTitle?: string;
  locale?: string | null;
}

function normalizePath(path: string | null | undefined, fallback?: string): string {
  const target = path ?? fallback ?? "/";
  const withLeadingSlash = target.startsWith("/") ? target : `/${target}`;
  return normalizeCanonicalPath(withLeadingSlash);
}

function extractSiteSection(segments: string[]): string | undefined {
  if (segments.length === 0) {
    return "home";
  }

  return segments[0] || "home";
}

function splitSegments(path: string): string[] {
  return path
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

export function buildAnalyticsContextFromContent(
  content: ContentWithRoute | null | undefined,
  options: BuildAnalyticsContextOptions = {}
): AnalyticsPageContext {
  const { fallbackPath, overrideTitle, locale } = options;
  const routePath = content?.route?.path ?? undefined;
  const normalizedPath = normalizePath(routePath ?? undefined, fallbackPath);
  const segments = splitSegments(normalizedPath);
  const canonicalUrl = buildCanonicalUrl(normalizedPath);

  return {
    pagePath: normalizedPath,
    pageTitle: overrideTitle ?? content?.name ?? undefined,
    nodeId: content?.id ?? undefined,
    nodeType: content?.contentType ?? undefined,
    locale: locale ?? content?.route?.culture ?? undefined,
    siteSection: extractSiteSection(segments),
    routeSegments: segments,
    canonicalUrl,
  };
}
