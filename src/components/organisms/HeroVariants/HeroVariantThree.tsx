"use client";

import { Button } from "@/components/atoms/ui/button";
import { HeroSectionData } from "@ihu/umbraco-components";
import { ArrowRight, CheckCircle2, Phone, Star } from "lucide-react";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";
import Link from "next/link";
import Image from "next/image";

import { UpsBlockData } from "@ihu/umbraco-components";
import { Card } from "@/components/atoms/ui/card";
import { buildUmbracoMediaUrl } from "@/lib/media";

/**
 * Hero Variant Two: Conversion-focused, full-bleed gradient hero with CTA pair and proof points
 */
export function HeroVariantThree({ content }: { content: HeroSectionData }) {
  const { trackCta } = useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();

  const blocks =
    content.upsBlocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];

  const primaryCta = content?.primaryCta?.[0];

  const handlePrimaryCta = () => {
    if (primaryCta?.url) {
      trackCta({
        action: "hero_primary",
        label: primaryCta.title || "Schedule an Evaluation",
        destination: primaryCta.url,
        blockId: blockContext?.blockId,
      });
    }
  };
  const imageSrc = buildUmbracoMediaUrl(content?.heroImage?.[0]?.url || "");

  // Parse headline to support highlighting with **word** syntax
  const parseHeadline = (headline: string | undefined) => {
    if (!headline) return { before: "", highlight: "", after: "" };

    const highlightMatch = headline.match(/^(.*?)\*\*(.*?)\*\*(.*)$/);
    if (highlightMatch) {
      return {
        before: highlightMatch[1],
        highlight: highlightMatch[2],
        after: highlightMatch[3],
      };
    }

    // If no markers, return the whole headline without highlighting
    return { before: headline, highlight: "", after: "" };
  };

  const { before, highlight, after } = parseHeadline(
    content?.headline ?? undefined
  );

  return (
    <>
      <section className="relative bg-gradient-to-br from-background via-background to-accent/30 overflow-hidden">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-primary text-primary" />
                {content?.tag}
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  {before}
                  {highlight && (
                    <>
                      {before && " "}
                      <span className="text-primary relative">
                        {highlight}
                        <svg
                          className="absolute -bottom-2 left-0 w-full"
                          height="8"
                          viewBox="0 0 200 8"
                          fill="none"
                        >
                          <path
                            d="M1 5.5C40 2.5 80 1 120 2.5C160 4 180 6 199 5.5"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="text-primary"
                          />
                        </svg>
                      </span>
                    </>
                  )}
                  {after && <> {after}</>}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {content?.subHeadline}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3">
                {blocks.map((child, idx) => (
                  <BlockRenderer key={idx} block={child.content} />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <a
                    href="tel:35355580"
                    className="flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Ring til os: 35 35 55 80
                  </a>
                </Button>

                {primaryCta && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-base px-8 py-6"
                    onClick={handlePrimaryCta}
                  >
                    <Link
                      href={primaryCta.route?.path || "#"}
                      target={primaryCta.target || "_self"}
                      className="flex items-center justify-center"
                    >
                      {primaryCta.title || "Schedule an Evaluation"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right Column - Visual Card */}
            <div className="relative lg:pl-8">
              {/* Main Image Card */}
              <Card className="overflow-hidden shadow-2xl">
                <div className="relative h-[500px] lg:h-[600px]">
                  <Image
                    src={imageSrc || ""}
                    alt={content.imageAltText || "Advanced medical technology"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    quality={85}
                    className="object-cover mix-blend-multiply opacity-80"
                  />
                </div>
              </Card>

              {/* Decorative Element */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/30 rounded-full blur-3xl opacity-50 -z-10" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
