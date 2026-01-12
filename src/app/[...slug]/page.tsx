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
          return (
            <article>
              <section className="bg-primary text-primary-foreground py-10">
                <div className="container mx-auto px-4 md:px-6">
                  <div className="mb-8">
                    <Breadcrumb>
                      <BreadcrumbList>
                        {breadcrumbs.map((crumb, idx) => (
                          <BreadcrumbItem key={idx}>
                            {crumb.href ? (
                              <BreadcrumbLink href={crumb.href}>
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
                  </div>
                  <div className="max-w-7xl">
                    <h1 className="text-4xl md:text-5xl font-headline  font-bold tracking-tighter ">
                      {title}
                    </h1>
                    <div
                      className="mx-auto mt-4 md:text-xl"
                      dangerouslySetInnerHTML={{
                        __html: contentArea?.markup || "",
                      }}
                    />
                  </div>
                </div>
              </section>
              {/*<section id="article" className="py-10 lg:py-10 bg-background">
                <div className="container mx-auto px-6 max-w-3xl">
                  <div className="flex items-center gap-4 mb-8">
                    <Image
                      src="https://placehold.co/48x48.png?text=SE"
                      alt="Author Samir Ejam"
                      width={48}
                      height={48}
                      className="rounded-full border"
                    />
                    <div>
                      <span className="font-medium text-foreground">
                        Af Samir Ejam
                      </span>
                      <span className="block text-muted-foreground text-xs">
                        26. november 2025
                      </span>
                    </div>
                  </div>
                  <div className="mb-10">
                    <Image
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                      alt="Ortopædkirurgi operation"
                      width={800}
                      height={400}
                      className="rounded-lg shadow-xl object-cover"
                    />
                  </div>

                  <div className="mt-10 flex justify-center">
                    <Button asChild>
                      <Link href="/about">
                        Læs mere om klinikken <span className="ml-2">→</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>*/}
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
            </article>
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
