import React from "react";
import { UpsBlockData } from "@ihu/umbraco-components";
import { DynamicIcon } from "lucide-react/dynamic";

import type { IconName } from "lucide-react/dynamic";

export default function Ups({ content }: { content: UpsBlockData }) {
  const iconName: IconName = (content.icon as IconName) || "camera";
  return (
    <li className="flex items-start gap-4">
      <DynamicIcon
        name={iconName}
        className="mt-1 h-6 w-6 shrink-0 text-primary"
        size={48}
      />
      <div>
        <h3 className="font-headline font-semibold">{content.smallText}</h3>
        <p className="text-muted-foreground">{content.boldText}</p>
      </div>
    </li>
  );
}
