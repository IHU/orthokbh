"use client";

import { createContext, useContext } from "react";
import type { AnalyticsPageContext } from "@/lib/analytics/schema";

const AnalyticsContext = createContext<AnalyticsPageContext | undefined>(
  undefined
);

export function AnalyticsProvider({
  value,
  children,
}: {
  value: AnalyticsPageContext;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext(): AnalyticsPageContext | undefined {
  return useContext(AnalyticsContext);
}
