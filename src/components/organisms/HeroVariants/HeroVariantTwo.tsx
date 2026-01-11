"use client";

import { Button } from "@/components/atoms/ui/button";
import { HeroSectionData } from "@ihu/umbraco-components";
import Image from "next/image";
import Link from "next/link";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";
import { buildUmbracoMediaUrl } from "@/lib/media";

/**
 * Hero Variant Two: Conversion-focused, full-bleed gradient hero with CTA pair and proof points
 */
export function HeroVariantTwo({ content }: { content: HeroSectionData }) {
  const { trackCta } = useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();

  const primaryCta = content?.primaryCta?.[0];
  const secondaryCta = content?.secondaryCta?.[0];

  const handlePrimaryCta = () => {
    if (primaryCta?.url) {
      trackCta({
        action: "hero_primary",
        label: primaryCta.title || "Primary CTA",
        destination: primaryCta.url,
        blockId: blockContext?.blockId,
      });
    }
  };

  const handleSecondaryCta = () => {
    if (secondaryCta?.url) {
      trackCta({
        action: "hero_secondary",
        label: secondaryCta.title || "Secondary CTA",
        destination: secondaryCta.url,
        blockId: blockContext?.blockId,
      });
    }
  };

  // Helper function to format title with underline on last 2 words
  const formatTitle = (title?: string | null) => {
    if (!title) return null;

    const words = title.split(" ");
    if (words.length <= 2) {
      return <span className="underline decoration-primary">{title}</span>;
    }

    const lastTwoWords = words.slice(-2).join(" ");
    const restOfTitle = words.slice(0, -2).join(" ");

    return (
      <>
        {restOfTitle}{" "}
        <span className="underline decoration-primary">{lastTwoWords}</span>
      </>
    );
  };
  const imageSrc = buildUmbracoMediaUrl(content?.heroImage?.[0]?.url || "");

  return (
    <section className="font-poppins grid lg:grid-cols-2 min-h-[70vh] items-stretch">
      <div className="relative h-[400px] lg:h-auto">
        <Image
          src={imageSrc || ""}
          alt={content.imageAltText || "Hands working"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/20" />
      </div>
      <div className="bg-secondary text-secondary-foreground flex flex-col justify-center p-12 lg:p-24">
        <h2 className="text-primary font-bold tracking-widest text-sm mb-6 uppercase">
          {content?.tag || content?.subHeadline}
        </h2>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8 tracking-tighter text-foreground">
          {formatTitle(content?.headline)}
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          {content?.subHeadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {primaryCta && (
            <Button
              asChild
              size="lg"
              className="rounded-none h-14"
              onClick={handlePrimaryCta}
            >
              <Link
                href={primaryCta.url || "#"}
                target={primaryCta.target || "_self"}
              >
                {primaryCta.title || "Get Started"}
              </Link>
            </Button>
          )}
          {secondaryCta && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none h-14"
              onClick={handleSecondaryCta}
            >
              <Link
                href={secondaryCta.url || "#"}
                target={secondaryCta.target || "_self"}
              >
                {secondaryCta.title || "Learn More"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
