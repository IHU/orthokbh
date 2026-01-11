import React from "react";
import { BlockRenderer } from "@/lib/BlockRenderer";
import { ContainerBlockData } from "@ihu/umbraco-components";
import { ContainerBlockPropertiesModel } from "@ihu/umbraco-components/dist/api/umbraco";

export default function Container({
  content,
}: {
  content: ContainerBlockData;
}) {
  // valid child block before rendering
  const validChildren =
    content.blocks?.items?.filter(
      (child) => child && child.content && child.content.properties
    ) || [];

  /*console.log(
    "Blocks:",
    validChildren
      .filter((item) => item?.content)
      .map((item) => item.content.contentType)
  );*/
  const sectionBgClass = content.sectionBackground
    ? `bg-${content.sectionBackground}/75`
    : "bg-secondary/75";
  return (
    <section className={`py-5 lg:py-16 ${sectionBgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
            {content.tag}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            {content.title}
          </p>
        </div>
        <div
          className={`grid gap-8 justify-items-center ${
            validChildren.length === 2
              ? "grid-cols-1 md:grid-cols-2 justify-center"
              : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {validChildren.map((child, idx) => (
            <div key={idx} className="w-full max-w-lg">
              <BlockRenderer block={child.content} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
