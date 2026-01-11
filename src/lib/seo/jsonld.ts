import { buildCanonicalUrl, DEFAULT_SITE_URL } from "@/lib/metadata";
import { buildUmbracoMediaUrl } from "@/lib/media";
import type { ContentContentModel } from "@ihu/umbraco-components";

export type BreadcrumbEntry = {
  name: string;
  href?: string;
};

export type JsonLdObject = Record<string, unknown>;

type OrganizationConfig = {
  name: string;
  legalName?: string;
  url?: string;
  logo?: string | null;
  telephone?: string | null;
  email?: string | null;
  address?: {
    streetAddress?: string | null;
    postalCode?: string | null;
    addressLocality?: string | null;
    addressCountry?: string | null;
  };
};

type WebSiteConfig = {
  name: string;
  url: string;
  searchPath?: string;
};

type ContentJsonLdOptions = {
  content: ContentContentModel;
  breadcrumbs?: BreadcrumbEntry[];
  description?: string | null;
  imageUrl?: string | null;
  type?: "Article" | "WebPage";
  locale?: string | null;
};

export function stringifyJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data, null, 2);
}

export function buildOrganizationJsonLd(config: OrganizationConfig): JsonLdObject {
  const { name, legalName, url, logo, telephone, email, address } = config;

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
  };

  if (legalName) {
    schema.legalName = legalName;
  }

  schema.url = url ?? DEFAULT_SITE_URL;

  if (logo) {
    schema.logo = buildUmbracoMediaUrl(logo) ?? logo;
  }

  if (telephone) {
    schema.telephone = telephone;
  }

  if (email) {
    schema.email = email;
  }

  if (address) {
    const { streetAddress, postalCode, addressLocality, addressCountry } = address;

    schema.address = {
      "@type": "PostalAddress",
      streetAddress: streetAddress ?? undefined,
      postalCode: postalCode ?? undefined,
      addressLocality: addressLocality ?? undefined,
      addressCountry: addressCountry ?? undefined,
    };
  }

  return schema;
}

export function buildWebSiteJsonLd(config: WebSiteConfig): JsonLdObject {
  const { name, url, searchPath } = config;
  const canonicalUrl = buildCanonicalUrl("/") ?? url;

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: canonicalUrl,
  };

  if (searchPath) {
    const searchUrl = buildCanonicalUrl(searchPath);

    if (searchUrl) {
      schema.potentialAction = {
        "@type": "SearchAction",
        target: `${searchUrl}{search_term_string}`,
        "query-input": "required name=search_term_string",
      };
    }
  }

  return schema;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.href ?? item.name ?? undefined),
    })),
  };
}

function resolveRouteCulture(content: ContentContentModel): string | undefined {
  const routeCulture = (content.route as { culture?: string | null } | null | undefined)?.culture;
  if (routeCulture) {
    return routeCulture;
  }

  const contentCulture = (content as unknown as { culture?: string | null }).culture;
  return contentCulture ?? undefined;
}

export function buildContentJsonLd(options: ContentJsonLdOptions): JsonLdObject {
  const { content, breadcrumbs, description, imageUrl, type = "WebPage", locale } = options;

  const canonicalUrl = buildCanonicalUrl(content.route?.path ?? undefined);
  const image = imageUrl ? buildUmbracoMediaUrl(imageUrl) ?? imageUrl : undefined;
  const resolvedLocale = locale ?? resolveRouteCulture(content);

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": type,
    headline: content.name ?? undefined,
    name: content.name ?? undefined,
    description: description ?? undefined,
    url: canonicalUrl,
    inLanguage: resolvedLocale,
    mainEntityOfPage: canonicalUrl,
    identifier: content.id ?? undefined,
  };

  if (image) {
    schema.image = image;
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = buildBreadcrumbJsonLd(breadcrumbs);
  }

  return schema;
}
