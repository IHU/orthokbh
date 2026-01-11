"use client";

import { HeroBlockData } from "@ihu/umbraco-components";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../atoms/button";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";
import { useAnalyticsBlock } from "@/components/analytics/analytics-block";

export default function Hero({ content }: { content: HeroBlockData }) {
  const sectionBgClass = content.sectionBackground
    ? `bg-${content.sectionBackground}/75`
    : "bg-secondary/75";
  const imageSrc = buildUmbracoMediaUrl(content.image?.url);
  const { trackCta } = useAnalyticsEvents();
  const blockContext = useAnalyticsBlock();

  const handlePrimaryCta = () => {
    trackCta({
      action: "hero_primary",
      label: "Skriv til os",
      destination: "/kontakt",
      blockId: blockContext?.blockId,
    });
  };

  const handleSecondaryCta = () => {
    trackCta({
      action: "hero_secondary",
      label: "Se Vores Ydelser",
      destination: "/services",
      blockId: blockContext?.blockId,
    });
  };

  return (
    <section className={`py-10 md:py-16 ${sectionBgClass}`}>
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 text-center md:grid-cols-2 md:px-6 md:text-left">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {content.title}
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            {content.text}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Button asChild size="lg" onClick={handlePrimaryCta}>
              <Link href="/contact">Contact us for a no-obligation offer.</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              onClick={handleSecondaryCta}
            >
              <Link href="/services">
                See our services.
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative h-80 w-full md:h-96">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={content.image?.name ?? "Clinic hero image"}
              fill
              data-ai-hint="operating theatre"
              className="rounded-lg object-cover shadow-lg"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
