import {
  stringifyJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildContentJsonLd,
  buildBreadcrumbJsonLd,
  type BreadcrumbEntry,
  type JsonLdObject,
} from "@/lib/seo/jsonld";
import { DEFAULT_TITLE, DEFAULT_SITE_URL } from "@/lib/metadata";
import type { ContentContentModel } from "@ihu/umbraco-components";

type OrganizationJsonLdProps = {
  name?: string;
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

const DEFAULT_ORGANIZATION = {
  name: "Uslu Solutions",
  legalName: "Uslu Solutions ApS",
  url: DEFAULT_SITE_URL,
  logo: "/media/logo.png",
  telephone: "+45 31 45 32 52",
  email: "web@uslu.dk",
  address: {
    streetAddress: "Dysseaasen 25",
    postalCode: "2600",
    addressLocality: "Glostrup",
    addressCountry: "DK",
  },
} satisfies OrganizationJsonLdProps;

function JsonLdScript({
  id,
  data,
}: {
  id: string;
  data: JsonLdObject;
}): JSX.Element {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringifyJsonLd(data) }}
    />
  );
}

export function OrganizationJsonLd(
  props: OrganizationJsonLdProps = {}
): JSX.Element {
  const {
    name = DEFAULT_ORGANIZATION.name,
    legalName = DEFAULT_ORGANIZATION.legalName,
    url = DEFAULT_ORGANIZATION.url,
    logo = DEFAULT_ORGANIZATION.logo,
    telephone = DEFAULT_ORGANIZATION.telephone,
    email = DEFAULT_ORGANIZATION.email,
    address,
  } = props;

  const resolvedAddress = {
    ...DEFAULT_ORGANIZATION.address,
    ...address,
  };

  const data = buildOrganizationJsonLd({
    name,
    legalName,
    url,
    logo,
    telephone,
    email,
    address: resolvedAddress,
  });

  return <JsonLdScript id="jsonld-organization" data={data} />;
}

export function WebSiteJsonLd({
  name = DEFAULT_TITLE,
  url = DEFAULT_SITE_URL,
  searchPath,
}: {
  name?: string;
  url?: string;
  searchPath?: string;
}): JSX.Element {
  const data = buildWebSiteJsonLd({
    name,
    url,
    searchPath,
  });

  return <JsonLdScript id="jsonld-website" data={data} />;
}

export function PageJsonLd({
  content,
  breadcrumbs,
  description,
  imageUrl,
  type,
  locale,
}: {
  content: ContentContentModel;
  breadcrumbs?: BreadcrumbEntry[];
  description?: string | null;
  imageUrl?: string | null;
  type?: "Article" | "WebPage";
  locale?: string | null;
}): JSX.Element | null {
  if (!content) {
    return null;
  }

  const data = buildContentJsonLd({
    content,
    breadcrumbs,
    description,
    imageUrl,
    type,
    locale,
  });

  return (
    <JsonLdScript id={`jsonld-page-${content.id ?? "unknown"}`} data={data} />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: BreadcrumbEntry[];
}): JSX.Element | null {
  if (!items || items.length === 0) {
    return null;
  }

  const data = buildBreadcrumbJsonLd(items);

  return <JsonLdScript id="jsonld-breadcrumb" data={data} />;
}
