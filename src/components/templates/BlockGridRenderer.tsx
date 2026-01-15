"use client";

import React from "react";
import { BlockRenderer } from "@/lib/BlockRenderer";
import type { Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem } from "@ihu/umbraco-components/dist/api/umbraco";

interface BlockGridRendererProps {
  blocks: Array<Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem>;
  gridColumns?: number;
  className?: string;
}

/**
 * BlockGridRenderer
 * Renders Umbraco Block Grid items with proper layout (columnSpan, rowSpan)
 */
export function BlockGridRenderer({
  blocks,
  gridColumns = 12,
  className = "",
}: BlockGridRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  console.log("BlockGridRenderer:", {
    itemCount: blocks.length,
    gridColumns,
    items: blocks.map((b) => ({
      contentType: b?.content?.contentType,
      columnSpan: b.columnSpan,
      rowSpan: b.rowSpan,
      hasAreas: b.areas && b.areas.length > 0,
      areaCount: b.areas?.length || 0,
    })),
  });

  return (
    <div className={`grid grid-cols-12 gap-6 ${className}`}>
      {blocks.map((gridItem, index) => {
        // Check if grid item has areas (nested layout)
        if (gridItem.areas && gridItem.areas.length > 0) {
          console.log(
            `Grid item [${index}] has ${gridItem.areas.length} areas`
          );
          return (
            <GridItemWithAreas
              key={gridItem.content?.id || `area-${index}`}
              gridItem={gridItem}
              index={index}
            />
          );
        }

        // Simple grid item without areas
        if (!gridItem?.content) {
          console.error(
            "BlockGridRenderer: Grid item missing content",
            gridItem
          );
          return null;
        }

        return (
          <GridItemRenderer
            key={gridItem.content.id || index}
            gridItem={gridItem}
            index={index}
          />
        );
      })}
    </div>
  );
}

/**
 * GridItemWithAreas
 * Handles grid items that contain nested areas
 */
function GridItemWithAreas({
  gridItem,
  index,
}: {
  gridItem: Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem;
  index: number;
}) {
  const { areas, columnSpan, rowSpan } = gridItem;
  const gridClasses = getGridClasses(columnSpan, rowSpan);

  console.log(`GridItemWithAreas [${index}]:`, {
    areaCount: areas?.length,
    columnSpan,
    rowSpan,
  });

  return (
    <div className={gridClasses}>
      <div className="grid grid-cols-12 gap-6 items-start">
        {areas?.map((area, areaIndex) => {
          const areaGridClasses = getGridClasses(area.columnSpan, area.rowSpan);

          console.log(`  Area [${areaIndex}] "${area.alias}":`, {
            columnSpan: area.columnSpan,
            itemCount: area.items?.length || 0,
            classes: areaGridClasses,
          });

          return (
            <div
              key={`${area.alias}-${areaIndex}`}
              className={`${areaGridClasses} self-start`}
            >
              {area.items?.map((item, itemIndex) => {
                if (!item?.content) {
                  console.error(`Area item [${itemIndex}] missing content`);
                  return null;
                }

                console.log(`    Item [${itemIndex}]:`, {
                  contentType: item.content.contentType,
                  columnSpan: item.columnSpan,
                });

                return (
                  <div key={item.content.id || `item-${itemIndex}`}>
                    <BlockRenderer block={item.content} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * GridItemRenderer
 * Renders individual grid item with layout classes and delegates to BlockRenderer
 */
function GridItemRenderer({
  gridItem,
  index,
}: {
  gridItem: Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem;
  index: number;
}) {
  const { content, columnSpan, rowSpan } = gridItem;

  if (!content) {
    return null;
  }

  const gridClasses = getGridClasses(columnSpan, rowSpan);

  console.log(`GridItem [${index}]:`, {
    contentType: content.contentType,
    columnSpan,
    rowSpan,
    classes: gridClasses,
  });

  return (
    <div className={gridClasses}>
      <BlockRenderer block={content} />
    </div>
  );
}

/**
 * Generate Tailwind grid classes based on span values
 */
function getGridClasses(columnSpan?: number, rowSpan?: number): string {
  const classes: string[] = [];

  if (columnSpan) {
    // Umbraco uses 12-column grid
    if (columnSpan === 12) classes.push("col-span-full");
    else if (columnSpan === 6) classes.push("md:col-span-6");
    else if (columnSpan === 4) classes.push("md:col-span-4");
    else if (columnSpan === 3) classes.push("md:col-span-3");
    else classes.push(`md:col-span-${columnSpan}`);
  }

  if (rowSpan && rowSpan > 1) {
    classes.push(`md:row-span-${rowSpan}`);
  }

  return classes.join(" ");
}
