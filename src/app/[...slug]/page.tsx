import { notFound } from "next/navigation";
import { ContentPage, type ContentContentModel } from "@ihu/umbraco-components";
import {
  ContentService,
  Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem,
  Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockItem,
} from "@ihu/umbraco-components/dist/api/umbraco";
import type { Metadata } from "next";
import { cache } from "react";
import { createMetadata, DEFAULT_TITLE } from "@/lib/metadata";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { ContentTemplate } from "@/components/templates/ContentTemplate";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/ui/breadcrumb";
import { AnalyticsProvider } from "@/components/analytics/use-analytics-context";
import { PageJsonLd, BreadcrumbJsonLd } from "@/components/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/utils";
import { buildAnalyticsContextFromContent } from "@/lib/analytics/context";
import { parseHeadline } from "@/lib/strings/utils";

// Viewport configuration for Next.js 15
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const apiKey =
  process.env.NEXT_APP_UMBRACO_SITE_API_KEY ??
  "6536e4ec-cba3-4411-a21e-d933eb7dcc26";
const startItem =
  process.env.NEXT_APP_UMBRACO_START_ITEM ??
  "396875a6-c69f-4913-b966-a34b72488b11";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

function formatUmbracoError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const status =
      "status" in error ? (error as { status?: number }).status : undefined;
    const statusText =
      "statusText" in error
        ? (error as { statusText?: string }).statusText
        : undefined;
    if (status || statusText) {
      return [status !== undefined ? `status ${status}` : undefined, statusText]
        .filter(Boolean)
        .join(" ");
    }
    if (
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
  }

  return "Unknown error";
}

const getContentByRoute = cache(
  async (route: string): Promise<ContentContentModel | null> => {
    if (!apiKey || !startItem) {
      return null;
    }

    try {
      const response = await ContentService.getContentItemByPath20({
        startItem,
        path: route,
        apiKey,
        expand: "properties[navigations[properties[visibleToNavigation]]]",
      });

      return response ? (response as ContentContentModel) : null;
    } catch (error) {
      const message = formatUmbracoError(error);
      console.error(`Error fetching Umbraco content: ${message}`);
      return null;
    }
  }
);

function normalizeRoute(slug: string[]): string {
  return slug.length > 0 ? slug.join("/").toLowerCase() : "";
}

function isSystemRoute(route: string): boolean {
  return route.startsWith(".well-known/") || route.startsWith("favicon.");
}

async function resolveRouteParams(paramsPromise: PageProps["params"]) {
  const { slug = [] } = await paramsPromise;
  const route = normalizeRoute(slug);

  return { slug, route };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { route } = await resolveRouteParams(params);

  if (isSystemRoute(route)) {
    return createMetadata({
      title: DEFAULT_TITLE,
      canonicalPath: route,
      type: "website",
    });
  }

  const content = await getContentByRoute(route);

  if (!content) {
    return createMetadata({
      title: DEFAULT_TITLE,
      canonicalPath: route,
      type: "website",
    });
  }

  const properties = (content.properties ?? {}) as {
    metaTitle?: string | null;
    metaDescription?: string | null;
    openGraphImage?: Array<{ url?: string | null }>;
    socialImage?: Array<{ url?: string | null }>;
  };

  const openGraphImages = properties.openGraphImage?.length
    ? properties.openGraphImage
    : properties.socialImage;

  const ogImageUrl =
    Array.isArray(openGraphImages) && openGraphImages.length > 0
      ? buildUmbracoMediaUrl(openGraphImages[0]?.url)
      : undefined;

  const canonicalPath = content.route?.path?.replace(/^\/+/, "") ?? route;

  return createMetadata({
    title: properties.metaTitle ?? content.name ?? DEFAULT_TITLE,
    description: properties.metaDescription,
    canonicalPath,
    type: "article",
    siteName: DEFAULT_TITLE,
    imageUrl: ogImageUrl,
  });
}

export default async function DynamicPage({ params }: PageProps) {
  const { route } = await resolveRouteParams(params);

  if (isSystemRoute(route)) {
    notFound();
  }

  const content = await getContentByRoute(route);

  if (!content) {
    notFound();
  }

  return <ArticlePage content={content} />;
}

function ArticlePage({ content }: { content: ContentContentModel }) {
  const pageContext = buildAnalyticsContextFromContent(content, {
    fallbackPath: "/",
  });
  const breadcrumbs = buildBreadcrumbs(content?.route?.path);

  const openGraphImageUrl = (
    content.properties as {
      openGraphImage?: Array<{ url?: string | null }>;
      socialImage?: Array<{ url?: string | null }>;
    }
  )?.openGraphImage?.[0]?.url;
  const socialImageUrl = (
    content.properties as {
      socialImage?: Array<{ url?: string | null }>;
    }
  )?.socialImage?.[0]?.url;
  const primaryImageUrl = openGraphImageUrl ?? socialImageUrl;

  return (
    <AnalyticsProvider value={pageContext}>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PageJsonLd
        content={content}
        type="Article"
        breadcrumbs={breadcrumbs}
        description={
          (content.properties as { metaDescription?: string | null })
            ?.metaDescription ?? null
        }
        imageUrl={primaryImageUrl ?? undefined}
        locale={pageContext.locale}
      />
      <ContentPage content={content}>
        {({ data }) => {
          const {
            title,
            contentArea,
            blocks,
            breadcrumbImage,
            // SEO
            metaTitle,
            metaDescription,
          } = data;

          // Parse title for styled headline rendering
          const { before, highlight, after } = parseHeadline(
            title ?? undefined
          );

          return (
            <div className="bg-background min-h-screen">
              {/* --- MODERN HERO SECTION --- */}
              <section className="relative py-8 overflow-hidden bg-primary">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
                  <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                  <Breadcrumb className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-10">
                    <BreadcrumbList>
                      {breadcrumbs.map((crumb, idx) => (
                        <BreadcrumbItem key={idx}>
                          {crumb.href ? (
                            <BreadcrumbLink
                              href={crumb.href}
                              className="text-primary-foreground"
                            >
                              {crumb.name}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                          )}
                          {idx < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                          )}
                        </BreadcrumbItem>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>

                  <div>
                    <h1 className="text-4xl md:text-7xl font-headline font-bold text-primary-foreground mb-8 tracking-tight">
                      {before}
                      {highlight && (
                        <>
                          <br />
                          <span className="text-primary-foreground/80 italic font-light tracking-normal">
                            {highlight}
                          </span>
                        </>
                      )}
                      {after}
                    </h1>
                    <div
                      className="text-primary-foreground/80 text-xl leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: contentArea?.markup || "",
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Dynamic Block List Renderer */}
              {blocks?.items && blocks.items.length > 0 && (
                <>
                  {/*console.log(
                    "Blocks:",
                    blocks.items
                      .filter((item) => item?.content)
                      .map((item) => item.content.contentType)
                  )*/}
                  <ContentTemplate
                    blocks={blocks.items
                      .filter((item) => item?.content)
                      .map(
                        (
                          item:
                            | Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockItem
                            | Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem
                        ) => item.content
                      )}
                  />
                </>
              )}
            </div>
          );
        }}
      </ContentPage>
    </AnalyticsProvider>
  );
}
// Generate static params for known routes (optional, for static generation)
export async function generateStaticParams() {
  // You can fetch all routes from Umbraco here if you want static generation
  // For now, return empty array for full dynamic rendering
  return [];
}
