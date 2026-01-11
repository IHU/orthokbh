import { TextWithImageBlockData } from "@ihu/umbraco-components";
import Image from "next/image";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { BlockRenderer } from "@/lib/BlockRenderer";
export default function TextWithImage({
  content,
}: {
  content: TextWithImageBlockData;
}) {
  const primaryImageUrl = buildUmbracoMediaUrl(content.images?.[0]?.url);
  const validChildren =
    content.blockContent?.blocks?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];
  console.log("TextWithImage content:", content.blockContent);
  return (
    <section id="praktisk-info" className="py-20 lg:py-32 bg-secondary/75">
      <div className="container mx-auto px-6 space-y-24">
        {/* Section 1: About the Clinic */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-sm font-bold text-accent-foreground uppercase tracking-wider">
              {content.tag}
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              {content.title}
            </h2>
            <div
              className="text-muted-foreground md:text-lg"
              dangerouslySetInnerHTML={{
                __html: content?.blockContent?.markup ?? "",
              }}
            ></div>
            <ul className="space-y-4">
              {validChildren.map((child, idx) => (
                <BlockRenderer key={idx} block={child.content} />
              ))}
            </ul>
          </div>
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={content.images?.[0]?.name || "Clinic image"}
              width={800}
              height={600}
              className="rounded-lg shadow-xl"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
