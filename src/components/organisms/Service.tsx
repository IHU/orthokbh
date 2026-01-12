import { ServiceCardData, useServiceCard } from "@ihu/umbraco-components";
import Link from "next/link";
import { Button } from "../atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../atoms/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Hospital,
  Stethoscope,
  Users,
} from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { Icon } from "@radix-ui/themes/components/callout";

export default function Service({ content }: { content: ServiceCardData }) {
  const iconName: IconName = content.icon
    ? (content.icon as IconName)
    : "stethoscope";
  console.log("List Items : ", content.listItems);
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
        <nav className="flex flex-col space-y-1">
          {content.link?.map((linkItem, index) => (
            <Link
              key={index}
              href={linkItem.route?.path ?? "#"}
              className="group/link flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-emerald-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-slate-700 group-hover/link:text-emerald-700">
                {linkItem.title}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover/link:text-emerald-500 transition-transform group-hover/link:translate-x-1" />
            </Link>
          ))}
        </nav>
        <ul className="space-y-4 mb-8 flex-grow">
          {content.listItems?.map((item, idx) => (
            <li className="flex gap-3 text-slate-700" key={idx}>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
