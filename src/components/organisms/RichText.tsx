import { BlockRenderer } from "@/lib/BlockRenderer";
import { ContactBlockData, RichTextBlockData } from "@ihu/umbraco-components";

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

export default function RichText({ content }: { content: RichTextBlockData }) {
  const validChildren =
    content.body?.blocks?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];

  const fixedMarkup = fixRelativeUrls(content.body?.markup || "");

  return (
    <>
      <section className="pb-8 pt-1 lg:pb-5 lg:pt-1">
        <div className="container mx-auto px-4 md:px-6">
          {content.body && (
            <div
              className="richtext"
              dangerouslySetInnerHTML={{ __html: fixedMarkup }}
            />
          )}
          {validChildren &&
            validChildren.map((block, idx) => {
              return <BlockRenderer key={idx} block={block.content} />;
            })}
        </div>
      </section>
    </>
  );
}
