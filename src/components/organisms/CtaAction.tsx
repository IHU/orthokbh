"use client";

import { CtaActionBlockData } from "@ihu/umbraco-components";
import { Button } from "@/components/atoms/ui/button";
import Link from "next/link";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";

export default function CtaAction({
  content,
}: {
  content: CtaActionBlockData;
}) {
  const { trackCta } = useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();

  const destination = content.cta?.[0]?.route?.path;

  const handleCtaClick = () => {
    if (!destination) {
      return;
    }

    trackCta({
      action: content.ctaLabel ?? "cta_action",
      label: content.headline ?? content.ctaLabel ?? "CTA",
      destination,
      blockId: blockContext?.blockId,
    });
  };

  // CTA Section
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          {content.headline}
        </h2>
        <p className="mt-4 max-w-xl mx-auto">{content.text}</p>
        {content.cta &&
        content.cta.length > 0 &&
        content.cta[0]?.route?.path ? (
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-8"
            onClick={handleCtaClick}
          >
            <Link href={content.cta[0].route.path}>{content.ctaLabel}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
