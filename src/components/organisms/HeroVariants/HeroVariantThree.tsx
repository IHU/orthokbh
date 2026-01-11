"use client";

import { Button } from "@/components/atoms/ui/button";
import { HeroSectionData } from "@ihu/umbraco-components";
import { CheckCircle2 } from "lucide-react";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";
import Link from "next/link";
import { UpsBlockData } from "@ihu/umbraco-components";

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

  return (
    <section className="font-poppins py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-blue-400 font-bold mb-4">
          {content?.tag || content?.subHeadline}
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          {content?.headline}
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          {content?.subHeadline}
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {blocks.map((child, idx) => (
            <BlockRenderer key={idx} block={child.content} />
          ))}
        </div>
        {primaryCta && (
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 h-14 px-12"
            onClick={handlePrimaryCta}
          >
            <Link
              href={primaryCta.url || "#"}
              target={primaryCta.target || "_self"}
            >
              {primaryCta.title || "Schedule an Evaluation"}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
