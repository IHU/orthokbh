"use client";

// templates/ContentTemplate.tsx
import { BlockRenderer } from "@/lib/BlockRenderer";
import React from "react";
import { AnalyticsBlock } from "@/components/analytics/analytics-block";

//ApiBlockItem | ApiBlockGridItem
export const ContentTemplate = ({ blocks }: { blocks: any[] }) => {
  return (
    <>
      {blocks
        .filter((b) => b && b.contentType && b.properties)
        .map((block, i) => {
          const blockType = block.contentType as string;
          const blockId = `${blockType || "block"}:${i}`;

          return (
            <AnalyticsBlock
              key={blockId}
              blockId={blockId}
              blockType={blockType}
              position={i}
            >
              <BlockRenderer block={block} />
            </AnalyticsBlock>
          );
        })}
    </>
  );
};
