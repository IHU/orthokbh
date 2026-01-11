import { ServiceCardData } from "@ihu/umbraco-components";
import Link from "next/link";
import { Button } from "../atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../atoms/ui/card";
import { ArrowRight, Hospital, Stethoscope, Users } from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { Icon } from "@radix-ui/themes/components/callout";

export default function Service({ content }: { content: ServiceCardData }) {
  const iconName: IconName = content.icon
    ? (content.icon as IconName)
    : "stethoscope";
  return (
    <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <DynamicIcon name={iconName} className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {content?.description}
        </CardDescription>
        {content.link && (
          <Button asChild variant="link" className="mt-4 px-0">
            <Link href={content.link.route?.path ?? "#"}>
              {content.link.title} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
