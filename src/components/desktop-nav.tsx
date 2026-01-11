"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavigationItem } from "@ihu/umbraco-components";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";

interface DesktopNavProps {
  navigation: NavigationItem[];
}

export function DesktopNav({ navigation }: DesktopNavProps) {
  const { trackNavigation } = useAnalyticsEvents();

  const handleNavigationClick = (
    item: NavigationItem,
    depth: number,
    label: string
  ) => {
    trackNavigation({
      action: "click",
      label,
      targetUrl: item.href,
      menu: "desktop",
      depth,
    });
  };

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden md:block">
        <ul className="flex space-x-6">
          {navigation.map((item, index) => (
            <li key={index} className="relative group">
              <Link
                href={item.href}
                onClick={() => handleNavigationClick(item, 0, item.label || "")}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium flex items-center gap-1"
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </Link>
              {/* Dropdown for children */}
              {item.children && item.children.length > 0 && (
                <ul className="absolute left-0 top-full mt-2 w-56 bg-popover border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 shadow-md">
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex} className="relative group/nested">
                      <Link
                        href={child.href}
                        onClick={() =>
                          handleNavigationClick(child, 1, child.label || "")
                        }
                        className="block px-4 py-2 text-popover-foreground hover:bg-accent transition-colors flex items-center justify-between"
                      >
                        {child.label}
                        {child.children && child.children.length > 0 && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </Link>
                      {/* Nested dropdown for grandchildren */}
                      {child.children && child.children.length > 0 && (
                        <ul className="absolute left-full top-0 w-56 bg-popover border rounded-md opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-200 py-2 ml-1 shadow-md">
                          {child.children.map((grandchild, grandchildIndex) => (
                            <li key={grandchildIndex}>
                              <Link
                                href={grandchild.href}
                                onClick={() =>
                                  handleNavigationClick(
                                    grandchild,
                                    2,
                                    grandchild.label || ""
                                  )
                                }
                                className="block px-4 py-2 text-popover-foreground hover:bg-accent transition-colors"
                              >
                                {grandchild.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
    </div>
  );
}
