"use client";

import { HeroSectionData } from "@ihu/umbraco-components";
import { Cpu, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../atoms/button";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";
import { buildUmbracoMediaUrl } from "@/lib/media";

/**
 * Hero Variant One: Conversion-focused, full-bleed gradient hero with CTA pair and proof points
 */
export function HeroVariantOne({ content }: { content: HeroSectionData }) {
  const { trackCta } = useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();

  const blocks =
    content.upsBlocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];

  const primaryCta = content?.primaryCta?.[0];
  const secondaryCta = content?.secondaryCta?.[0];
  console.log("secondaryCta : ", primaryCta, secondaryCta?.url);
  const handlePrimaryCta = () => {
    if (primaryCta?.route?.path) {
      trackCta({
        action: "hero_primary",
        label: primaryCta.title || "Primary CTA",
        destination: primaryCta.route?.path,
        blockId: blockContext?.blockId,
      });
    }
  };

  const handleSecondaryCta = () => {
    if (secondaryCta?.route?.path) {
      trackCta({
        action: "hero_secondary",
        label: secondaryCta.title || "Secondary CTA",
        destination: secondaryCta.route?.path,
        blockId: blockContext?.blockId,
      });
    }
  };

  const imageSrc = buildUmbracoMediaUrl(content?.heroImage?.[0]?.url || "");
  return (
    <section className="font-body py-20 bg-secondary/75 border-b border-border">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center text-foreground">
        <div className="order-2 lg:order-1 relative aspect-video bg-muted rounded-3xl overflow-hidden shadow-inner border border-border">
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
        <div className="order-1 lg:order-2">
          <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">
            {content?.tag}
          </h2>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {content?.headline}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {content?.subHeadline}
          </p>
          <div className="space-y-4 mb-8">
            {blocks.map((child, idx) => (
              <BlockRenderer key={idx} block={child.content} />
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            {primaryCta && (
              <Button
                asChild
                size="lg"
                className="h-14 px-10"
                onClick={handlePrimaryCta}
              >
                <Link
                  href={primaryCta.route?.path || "#"}
                  target={primaryCta.target || "_self"}
                >
                  {primaryCta.title || "Learn More"}
                </Link>
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10"
                onClick={handleSecondaryCta}
              >
                <Link
                  href={secondaryCta.route?.path || "#"}
                  target={secondaryCta.target || "_self"}
                >
                  {secondaryCta.title || "Contact Us"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
