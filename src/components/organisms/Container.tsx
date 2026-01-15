"use client";

import React from "react";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { BlockGridRenderer } from "@/components/templates/BlockGridRenderer";
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

  // Early return if no content
  if (!content) {
    console.warn("Container: No content provided");
    return null;
  }

  // Check for grid data
  const hasGrid = content?.grid?.items && content.grid.items.length > 0;
  const gridBlocks = content?.grid?.items || [];

  // valid child block before rendering
  const validChildren =
    content?.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];

  // Debug logging
  if (hasGrid) {
    console.log("Container - Grid detected:", {
      gridColumns: content.grid?.gridColumns,
      itemCount: content.grid?.items.length,
    });
  }
  if (validChildren.length > 0) {
    console.log("Container - Regular blocks:", validChildren.length);
  }

  const sectionBgClass = content?.sectionBackground
    ? `bg-${content.sectionBackground}/75`
    : "bg-secondary/75";
  const columns = content.column || 0;
  const textAlign = content.textAlignment || "center";
  const isCentered = textAlign === "center";

  const handleCtaClick = () => {
    if (content?.link?.route?.path) {
      trackCta({
        action: "container_cta",
        label: content.link?.title || "Learn More",
        destination: content.link.route?.path,
        blockId: blockContext?.blockId,
      });
    }
  };
  console.log("Container Grid:", content.grid);
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
          {content?.link && (
            <Link
              href={content.link?.route?.path || "#"}
              onClick={handleCtaClick}
              className="mt-6 md:mt-0 md:absolute md:top-0 md:right-0 inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border-2 border-foreground rounded-full text-foreground font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group w-full md:w-auto"
            >
              {content.link.title || "Learn More"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Render Block Grid if available */}
        {hasGrid && (
          <div className="mb-8">
            <BlockGridRenderer
              blocks={gridBlocks}
              gridColumns={content.grid?.gridColumns}
            />
          </div>
        )}

        {/* Render regular blocks if available */}
        {validChildren.length > 0 && (
          <div
            className={`grid gap-8 justify-items-center ${
              validChildren.length === 2
                ? "grid-cols-1 md:grid-cols-2 justify-center"
                : `grid-cols-1 md:grid-cols-${columns}`
            }`}
          >
            {validChildren.map((child, idx) => (
              <div
                key={idx}
                className={`w-full ${columns !== 0 ? "max-w-lg" : ""}`}
              >
                <BlockRenderer block={child.content} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
