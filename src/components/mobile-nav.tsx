"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/atoms/sheet";

import { cn } from "@/lib/utils";
import { NavigationItem } from "@ihu/umbraco-components";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";

interface MobileNavProps {
  navigation: NavigationItem[];
  logo?: string;
}

export function MobileNav({ navigation, logo }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<number>>(
    new Set()
  );
  const { trackNavigation } = useAnalyticsEvents();

  const toggleItem = (key: number, depth: number, label: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      const hasKey = newSet.has(key);

      if (hasKey) {
        newSet.delete(key);
        trackNavigation({ action: "close", label, menu: "mobile", depth });
      } else {
        newSet.add(key);
        trackNavigation({ action: "open", label, menu: "mobile", depth });
      }
      return newSet;
    });
  };

  const renderNavItems = (
    items: NavigationItem[],
    level = 0,
    parentIndex = ""
  ) => {
    return (
      <div className={cn("space-y-1", level > 0 && "ml-4 mt-2")}>
        {items.map((item, index) => {
          const itemIndex = parentIndex ? `${parentIndex}-${index}` : index;
          const uniqueKey =
            typeof itemIndex === "string"
              ? itemIndex.split("-").reduce((a, b) => a * 100 + parseInt(b), 0)
              : itemIndex;
          const isExpanded = expandedItems.has(uniqueKey);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={index} className="group">
              <div className="flex items-center gap-2">
                <Link
                  href={item.href}
                  onClick={() => {
                    trackNavigation({
                      action: "click",
                      label: item.label || "",
                      targetUrl: item.href,
                      menu: "mobile",
                      depth: level,
                    });
                    if (!hasChildren) {
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    "flex-1 flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-200",
                    "hover:bg-accent/50 active:scale-[0.98]",
                    level === 0
                      ? "font-semibold text-base"
                      : "font-medium text-sm",
                    level > 0 && "border-l-2 border-border/50"
                  )}
                >
                  <span className="flex-1">{item.label}</span>
                </Link>
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toggleItem(uniqueKey, level, item.label || "")
                    }
                    className="h-10 w-10 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform" />
                    )}
                  </Button>
                )}
              </div>
              {hasChildren && isExpanded && (
                <div className="mt-1 pl-2 border-l-2 border-primary/20 ml-4">
                  {renderNavItems(item.children!, level + 1, String(itemIndex))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        trackNavigation({
          action: nextOpen ? "open" : "close",
          label: "mobile-menu",
          menu: "mobile",
          depth: 0,
        });
      }}
    >
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b bg-muted/30">
          <SheetTitle className="text-xl">
            <div className="logo">
              <Link href="/" className="text-xl md:text-2xl font-bold">
                {logo ? (
                  <Image
                    src={logo}
                    width={556}
                    height={56}
                    alt="Ortopædkirurgisk Klinik ved Søerne"
                  />
                ) : (
                  <span>Ortopædkirurgisk Klinik ved Søerne</span>
                )}
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {renderNavItems(navigation)}
        </nav>

        {/* Footer */}
        <div className="border-t bg-muted/30 px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 Uslu Solutions
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
