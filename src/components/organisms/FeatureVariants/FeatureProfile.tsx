import Image from "next/image";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";

import { BadgeCheck, Clock, MapPin, Award } from "lucide-react";
import { FeatureBlockData, UpsBlockData } from "@ihu/umbraco-components";
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
export default function FeatureProfile({
  content,
}: {
  content: FeatureBlockData;
}) {
  const highlights = [
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      text: "Speciallæge siden 2008",
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Ekspert i hånd- & fodkirurgi",
    },
    { icon: <Clock className="w-5 h-5" />, text: "Korte ventetider" },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "Centralt på Rosenørns Allé",
    },
  ];
  const imageSrc = buildUmbracoMediaUrl(content.image?.url);
  const fixedMarkup = fixRelativeUrls(content.text?.markup || "");
  const blocks =
    content.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];
  return (
    <section className="py-20 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Venstre side: Billede/Visuelt */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-primary/5 relative z-10 shadow-2xl">
              {/* Erstat src med det rigtige billede af Samir */}
              {
                <Image
                  src={imageSrc || ""}
                  alt="Speciallæge Samir Ejam"
                  fill
                  className="object-cover"
                />
              }
            </div>
            {/* Dekorativt element bag billedet */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full -z-0 opacity-50" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full -z-0" />
          </div>

          {/* Højre side: Tekstindhold */}
          <div className="space-y-6">
            <div>
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
                {content.tag}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {content.title}
              </h3>
            </div>
            <div className="space-y-4 text-muted-foreground">
              {content.text && (
                <div dangerouslySetInnerHTML={{ __html: fixedMarkup }} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 py-6">
              {blocks.map((item, idx) => {
                const step = item.content.properties as UpsBlockData;
                const iconName: IconName = step.icon
                  ? (step.icon as IconName)
                  : "circle";
                console.log("Block Item : ", step, step.icon);
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 text-foreground"
                  >
                    <DynamicIcon name={iconName} className="text-primary" />
                    <div className="pt-1 md:pt-1.5 lg:pt-2">
                      <span className="text-sm font-medium">
                        {step.boldText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
