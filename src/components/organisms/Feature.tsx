import { FeatureBlockData } from "@ihu/umbraco-components";
import Image from "next/image";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { buildUmbracoMediaUrl } from "@/lib/media";

export default function Feature({ content }: { content: FeatureBlockData }) {
  const blocks =
    content.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];
  const sectionBgClass = content.sectionBackground
    ? `bg-${content.sectionBackground}/75`
    : "bg-secondary/75";
  const imageSrc = buildUmbracoMediaUrl(content.image?.url);

  return (
    <section className={`py-16 md:py-24 ${sectionBgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative h-80 w-full md:h-96">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={content.image?.name ?? "Clinic feature image"}
                fill
                data-ai-hint="operating theatre"
                className="rounded-lg object-cover shadow-lg"
              />
            ) : null}
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              {content.title}
            </h2>
            <div
              className="text-muted-foreground md:text-lg"
              dangerouslySetInnerHTML={{ __html: content.text?.markup || "" }}
            />
            <ul className="space-y-4">
              {blocks.map((child, idx) => (
                <BlockRenderer key={idx} block={child.content} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
