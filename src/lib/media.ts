const serverUmbracoBaseUrl = process.env.NEXT_APP_UMBRACO_BASE_URL ?? "";
const publicUmbracoBaseUrl =
  process.env.NEXT_PUBLIC_UMBRACO_MEDIA_BASE_URL ??
  process.env.NEXT_PUBLIC_UMBRACO_BASE_URL ??
  "";

function sanitizeBaseUrl(raw: string): string {
  return raw.replace(/\/+$/, "");
}

function resolveMediaBaseUrl(): string {
  if (typeof window === "undefined") {
    return sanitizeBaseUrl(serverUmbracoBaseUrl);
  }

  const resolved = publicUmbracoBaseUrl || serverUmbracoBaseUrl;
  return sanitizeBaseUrl(resolved);
}

export function buildUmbracoMediaUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = resolveMediaBaseUrl();

  if (!baseUrl) {
    return undefined;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}
