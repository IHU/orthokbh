import { BlockRenderer } from "@/lib/BlockRenderer";
import { ContactBlockData } from "@ihu/umbraco-components";
import { Badge } from "../atoms/ui/badge";

export default function Contact({ content }: { content: ContactBlockData }) {
  // valid child block before rendering
  const validChildren =
    content.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];
  return (
    <div className="grid lg:grid-cols-1 gap-12 lg:gap-16 mb-16">
      <div className="space-y-8">
        <div>
          <Badge color="orange">{content.tag}</Badge>
        </div>
        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          {content.title}
        </h2>
        <div
          className="text-muted-foreground md:text-lg"
          dangerouslySetInnerHTML={{
            __html: content?.description?.markup ?? "",
          }}
        />
        <ul className="space-y-4">
          {validChildren.map((child, idx) => (
            <BlockRenderer key={idx} block={child.content} />
          ))}
        </ul>
      </div>
    </div>
  );
}
