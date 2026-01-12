"use client";
import { FeatureBlockData, ServiceCardData } from "@ihu/umbraco-components";
import Image from "next/image";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";

const baseUrl = process.env.NEXT_APP_UMBRACO_BASE_URL || "";

function fixRelativeUrls(html: string): string {
  if (!baseUrl || !html) return html;

  // Fix relative image src attributes
  let fixedHtml = html.replace(
    /(<img[^>]+src=["'])(\/)([^"']+)(["'])/gi,
    `$1${baseUrl}$2$3$4`
  );

  // Fix relative href attributes in links
  fixedHtml = fixedHtml.replace(
    /(<a[^>]+href=["'])(\/)([^"']+)(["'])/gi,
    `$1${baseUrl}$2$3$4`
  );

  return fixedHtml;
}
export default function FeatureProcess({
  content,
}: {
  content: FeatureBlockData;
}) {
  const blocks =
    content.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];
  const sectionBgClass = content.sectionBackground
    ? `bg-${content.sectionBackground}/75`
    : "bg-secondary/75";
  const imageSrc = buildUmbracoMediaUrl(content.image?.url);

  const fixedMarkup = fixRelativeUrls(content.text?.markup || "");
  return (
    <section className={`py-12 md:py-16 lg:py-24 px-4 ${sectionBgClass}`}>
      <div className="max-w-5xl mx-auto text-center mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">
          {content.title || ""}
        </h2>
        <div className="text-sm md:text-base text-muted-foreground">
          {content.text && (
            <div dangerouslySetInnerHTML={{ __html: fixedMarkup }} />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Process Steps */}
          <div className="relative">
            {/* Lodret linje til tidslinje (kun desktop) */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-primary/10" />

            <div className="space-y-8 md:space-y-10 lg:space-y-12">
              {blocks.map((item, idx) => {
                const step = item.content.properties as ServiceCardData;
                const iconName: IconName = step.icon
                  ? (step.icon as IconName)
                  : "circle";
                console.log("Block Item : ", step, step.icon);
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 items-start"
                  >
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-primary shadow-sm">
                      <DynamicIcon
                        name={iconName}
                        className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                    </div>
                    <div className="pt-1 md:pt-1.5 lg:pt-2">
                      <h4 className="text-lg md:text-xl font-bold text-foreground mb-1.5 md:mb-2">
                        {step.title}
                      </h4>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Image/Video */}
          {imageSrc && (
            <div className="relative lg:sticky lg:top-8">
              <div className="relative aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={imageSrc}
                  alt={content.title || "Process illustration"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
