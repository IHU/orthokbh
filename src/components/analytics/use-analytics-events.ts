"use client";

import { useAnalyticsContext } from "@/components/analytics/use-analytics-context";
import {
  trackBlockImpression,
  trackCta,
  trackFormStart,
  trackFormSubmit,
  trackFormView,
  trackNavigation,
} from "@/lib/analytics/events";
import type {
  BlockImpressionEvent,
  CtaEvent,
  FormStartEvent,
  FormSubmitEvent,
  FormViewEvent,
  NavigationEvent,
} from "@/lib/analytics/events";
import type { AnalyticsPageContext } from "@/lib/analytics/schema";

function withContext<T>(
  payload: T,
  context: AnalyticsPageContext | undefined
): T & { context?: AnalyticsPageContext } {
  const existingContext = (payload as { context?: AnalyticsPageContext }).context;

  return {
    ...payload,
    context: existingContext ?? context,
  };
}

export function useAnalyticsEvents() {
  const context = useAnalyticsContext();

  return {
    trackNavigation: (payload: Omit<NavigationEvent, "context">) =>
      trackNavigation(withContext(payload, context)),
    trackCta: (payload: Omit<CtaEvent, "context">) =>
      trackCta(withContext(payload, context)),
    trackBlockImpression: (payload: Omit<BlockImpressionEvent, "context">) =>
      trackBlockImpression(withContext(payload, context)),
    trackFormView: (payload: Omit<FormViewEvent, "context">) =>
      trackFormView(withContext(payload, context)),
    trackFormStart: (payload: Omit<FormStartEvent, "context">) =>
      trackFormStart(withContext(payload, context)),
    trackFormSubmit: (payload: Omit<FormSubmitEvent, "context">) =>
      trackFormSubmit(withContext(payload, context)),
  };
}
