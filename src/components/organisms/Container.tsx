"use client";

import React from "react";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { ContainerBlockData } from "@ihu/umbraco-components";
import { ContainerBlockPropertiesModel } from "@ihu/umbraco-components/dist/api/umbraco";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";

export default function Container({
  content,
}: {
  content: ContainerBlockData;
}) {
  const { trackCta } = useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();

  // valid child block before rendering
  const validChildren =
    content.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];

  /*console.log(
    "Blocks:",
    validChildren
      .filter((item) => item?.content)
      .map((item) => item.content.contentType)
  );*/
  const sectionBgClass = content.sectionBackground
    ? `bg-${content.sectionBackground}/75`
    : "bg-secondary/75";
  const columns = content.column || 4;
  const textAlign = content.textAlignment || "center";
  const isCentered = textAlign === "center";

  const handleCtaClick = () => {
    if (content?.link?.[0].route?.path) {
      trackCta({
        action: "container_cta",
        label: content.link?.[0].title || "Learn More",
        destination: content.link?.[0].route?.path,
        blockId: blockContext?.blockId,
      });
    }
  };

  return (
    <section className={`py-5 lg:py-16 ${sectionBgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative mb-12">
          <div className={`text-${textAlign}`}>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              {content.tag}
            </h2>
            <p
              className={`mt-4 max-w-2xl text-muted-foreground md:text-lg ${
                isCentered ? "mx-auto" : ""
              }`}
            >
              {content.title}
            </p>
          </div>
          {content?.link?.[0]?.route?.path && (
            <Link
              href={content.link[0].route.path}
              onClick={handleCtaClick}
              className="absolute top-0 right-0 inline-flex items-center px-8 py-4 border-2 border-foreground rounded-full text-foreground font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
            >
              {content.link[0].title || "Learn More"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div
          className={`grid gap-8 justify-items-center ${
            validChildren.length === 2
              ? "grid-cols-1 md:grid-cols-2 justify-center"
              : `grid-cols-1 md:grid-cols-${columns}`
          }`}
        >
          {validChildren.map((child, idx) => (
            <div key={idx} className="w-full max-w-lg">
              <BlockRenderer block={child.content} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
