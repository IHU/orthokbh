import { AnalyticsProvider } from "@/components/analytics/use-analytics-context";
import { ContentTemplate } from "@/components/templates/ContentTemplate";
import { buildAnalyticsContextFromContent } from "@/lib/analytics/context";
import {
  ContentService,
  Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem,
  Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockItem,
} from "@ihu/umbraco-components/dist/api/umbraco";
import { HomeContentModel, HomePage } from "@ihu/umbraco-components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createMetadata } from "@/lib/metadata";
import { PageJsonLd } from "@/components/seo/jsonld";

const apiKey =
  process.env.NEXT_APP_UMBRACO_SITE_API_KEY ??
  "6536e4ec-cba3-4411-a21e-d933eb7dcc26";
const startItem =
  process.env.NEXT_APP_UMBRACO_START_ITEM ??
  "396875a6-c69f-4913-b966-a34b72488b11";

const getHomeContent = cache(async (): Promise<HomeContentModel | null> => {
  try {
    const response = await ContentService.getContentItemByPath20({
      startItem,
      path: "",
      apiKey,
    });

    return response ? (response as HomeContentModel) : null;
  } catch (error) {
    console.error("Error fetching home content:", error);
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent();
  const properties = content?.properties ?? {};

  return createMetadata({
    title: (properties as { metaTitle?: string | null })?.metaTitle,
    description: (properties as { metaDescription?: string | null })
      ?.metaDescription,
    canonicalPath: "",
    type: "website",
    imageUrl: (properties as {
      ogImage?: Array<{ url?: string | null }>;
    })?.ogImage?.[0]?.url,
       
  });
}

export default async function Home() {
  const content = await getHomeContent();

  if (!content) {
    notFound();
  }

  return <ContentPageRenderer content={content} />;
}

function ContentPageRenderer({ content }: { content: HomeContentModel }) {
  const pageContext = buildAnalyticsContextFromContent(content, {
    fallbackPath: "/",
  });

  return (
    <AnalyticsProvider value={pageContext}>
      <PageJsonLd
        content={content}
        type="WebPage"
        description={
          (content.properties as { metaDescription?: string | null })
            ?.metaDescription ?? null
        }
        imageUrl={
          (
            content.properties as {
              openGraphImage?: Array<{ url?: string | null }>;
            }
          )?.openGraphImage?.[0]?.url ?? null
        }
      />
      <HomePage content={content}>
        {({ data }) => {
          const { blocks } = data;

          return (
            <div className="flex flex-col">
              {blocks?.items && blocks.items.length > 0 && (
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
              )}
            </div>
          );
        }}
      </HomePage>
    </AnalyticsProvider>
  );
}
