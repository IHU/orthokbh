"use client";
import { FeatureBlockData, ServiceCardData } from "@ihu/umbraco-components";
import Image from "next/image";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import Link from "next/link";
import {
  User,
  Calendar,
  Stethoscope,
  ArrowUpRight,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";
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
export default function FeatureGuide({
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
    <div className="bg-background pb-8">
      {/* --- QUICK HELP & CONTACT SECTION --- */}
      <section className="mt-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-headline font-bold text-foreground mb-6">
                {content.title}
              </h2>
              <div
                className="text-muted-foreground text-lg"
                dangerouslySetInnerHTML={{
                  __html: fixedMarkup,
                }}
              ></div>
            </div>

            <div className="space-y-8">
              {blocks.map((item, i) => {
                const step = item.content.properties as ServiceCardData;
                const iconName: IconName = step.icon
                  ? (step.icon as IconName)
                  : "circle";
                return (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-1">
                        {step.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Contact Glass Card 
          <div className="lg:col-span-5">
            <div className="bg-primary rounded-[3rem] p-10 md:p-14 text-primary-foreground relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/20 blur-[80px]" />

              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Info className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">Har du spørgsmål?</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <Phone className="w-6 h-6 text-primary-foreground shrink-0" />
                    <div>
                      <p className="text-primary-foreground/50 text-xs uppercase font-bold tracking-widest mb-1">
                        Telefon
                      </p>
                      <p className="text-xl font-medium">43 96 02 55</p>
                      <p className="text-sm text-primary-foreground/40 mt-1">
                        Man-Tor: 08:00 - 16:00
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <MapPin className="w-6 h-6 text-primary-foreground shrink-0" />
                    <div>
                      <p className="text-primary-foreground/50 text-xs uppercase font-bold tracking-widest mb-1">
                        Adresse
                      </p>
                      <p className="text-xl font-medium text-balance">
                        Rosenørns Allé 4, st. tv <br /> 1634 København V
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/kontakt"
                  className="w-full py-5 bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Gå til kontakt
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>*/}
        {/*</div>*/}
      </section>
    </div>
  );
}
