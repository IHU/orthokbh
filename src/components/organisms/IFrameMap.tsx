import { IFrameBlockData } from "@ihu/umbraco-components";

export default function IFrameMap({ content }: { content: IFrameBlockData }) {
  // Ensure src is a string, default to empty string if null or undefined.    // Ensure width and height are string or number, default to undefined if null or undefined.
  // Assuming width and height can be string (e.g., "100%") or number (e.g., 500).
  // Passing undefined means the browser will use default sizing or CSS.
  const iframeWidth = content.width ?? undefined;
  const iframeHeight = content.height ?? undefined;
  // Optional: Only render the iframe if a source URL is provided
  if (
    !content.src ||
    typeof content.src !== "string" ||
    !/^https?:\/\//.test(content.src)
  ) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        Iframe source URL is missing or invalid.
      </div>
    );
  }

  return (
    <section className="bg-primary text-primary-foreground">
      <iframe
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ border: 0, minHeight: 300, display: "block" }}
        loading="lazy"
        allowFullScreen
        // Pass the guaranteed string src
        src={content.src}
        title="Embedded content" // Added a title for accessibility
      ></iframe>
    </section>
  );
}
