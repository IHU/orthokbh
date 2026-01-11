import { analyticsConfig, shouldLoadAnalytics } from "@/lib/analytics";
import type {
  AnalyticsPageContext,
  BlockImpressionPayload,
  CtaInteractionPayload,
  ConsentState,
  FormStartPayload,
  FormSubmitPayload,
  FormViewPayload,
  NavigationInteractionPayload,
} from "@/lib/analytics/schema";

const { measurementId } = analyticsConfig;

function emitEvent(eventName: string, params: Record<string, unknown>): void {
  if (!shouldLoadAnalytics() || typeof window === "undefined") {
    return;
  }

  if (!measurementId) {
    return;
  }

  window.gtag?.("event", eventName, params);
}

function resolvePagePath(context?: AnalyticsPageContext): string | undefined {
  if (context?.pagePath) {
    return context.pagePath;
  }

  if (typeof window === "undefined") {
    return undefined;
  }

  const { pathname, search } = window.location;
  return search ? `${pathname}${search}` : pathname;
}

function contextToParams(context?: AnalyticsPageContext): Record<string, unknown> {
  if (!context) {
    const fallback = resolvePagePath();
    return fallback ? { page_path: fallback } : {};
  }

  const params: Record<string, unknown> = {};

  const path = resolvePagePath(context);
  if (path) {
    params.page_path = path;
  }

  if (context.pageTitle) {
    params.page_title = context.pageTitle;
  }

  if (context.nodeId) {
    params.node_id = context.nodeId;
  }

  if (context.nodeType) {
    params.node_type = context.nodeType;
  }

  if (context.locale) {
    params.locale = context.locale;
  }

  if (context.siteSection) {
    params.site_section = context.siteSection;
  }

  if (context.routeSegments && context.routeSegments.length > 0) {
    params.route_segments = context.routeSegments.join("/");
  }

  if (context.canonicalUrl) {
    params.canonical_url = context.canonicalUrl;
  }

  return params;
}

function applyCommonMetadata(
  params: Record<string, unknown>,
  context?: AnalyticsPageContext,
  consentState?: ConsentState,
  timestamp?: number
): Record<string, unknown> {
  Object.assign(params, contextToParams(context));

  if (typeof consentState !== "undefined") {
    params.consent_state = consentState;
  }

  if (typeof timestamp === "number") {
    params.event_timestamp = timestamp;
  }

  return params;
}

export type BlockImpressionEvent = BlockImpressionPayload & {
  metadata?: Record<string, unknown>;
};

export function trackBlockImpression(event: BlockImpressionEvent): void {
  const { blockId, blockType, position, variant, metadata, context, consentState, timestamp } = event;

  const params: Record<string, unknown> = applyCommonMetadata(
    {
      block_id: blockId,
      block_type: blockType,
      position,
      variant,
    },
    context,
    consentState,
    timestamp
  );

  if (metadata) {
    Object.assign(params, metadata);
  }

  emitEvent("block_impression", params);
}

export type ConversionEvent = CtaInteractionPayload & {
  category?: string;
  value?: number;
  metadata?: Record<string, unknown>;
};

export function trackConversion(event: ConversionEvent): void {
  const { action, label, destination, category, value, metadata, context, consentState, timestamp, blockId } = event;

  const params: Record<string, unknown> = applyCommonMetadata(
    {
      action,
      event_category: category ?? "conversion",
      event_label: label,
      destination,
      block_id: blockId,
      value,
    },
    context,
    consentState,
    timestamp
  );

  if (metadata) {
    Object.assign(params, metadata);
  }

  emitEvent("conversion", params);
}

export type NavigationEvent = NavigationInteractionPayload & {
  metadata?: Record<string, unknown>;
};

export function trackNavigation(event: NavigationEvent): void {
  const { action, label, targetUrl, menu, depth, metadata, context, consentState, timestamp } = event;

  const params: Record<string, unknown> = applyCommonMetadata(
    {
      action,
      label,
      target_url: targetUrl,
      menu,
      depth,
    },
    context,
    consentState,
    timestamp
  );

  if (metadata) {
    Object.assign(params, metadata);
  }

  emitEvent("navigation_interaction", params);
}

export type CtaEvent = CtaInteractionPayload & {
  metadata?: Record<string, unknown>;
};

export function trackCta(event: CtaEvent): void {
  const { action, label, destination, blockId, metadata, context, consentState, timestamp } = event;

  const params: Record<string, unknown> = applyCommonMetadata(
    {
      action,
      label,
      destination,
      block_id: blockId,
    },
    context,
    consentState,
    timestamp
  );

  if (metadata) {
    Object.assign(params, metadata);
  }

  emitEvent("cta_click", params);
}

export type FormViewEvent = FormViewPayload & { metadata?: Record<string, unknown> };
export type FormStartEvent = FormStartPayload & { metadata?: Record<string, unknown> };
export type FormSubmitEvent = FormSubmitPayload & { metadata?: Record<string, unknown> };

export function trackFormView(event: FormViewEvent): void {
  emitFormEvent("form_view", event);
}

export function trackFormStart(event: FormStartEvent): void {
  emitFormEvent("form_start", event);
}

export function trackFormSubmit(event: FormSubmitEvent): void {
  emitFormEvent("form_submit", event);
}

function emitFormEvent(
  eventName: "form_view" | "form_start" | "form_submit",
  payload: (FormViewEvent | FormStartEvent | FormSubmitEvent)
): void {
  const { formId, formName, metadata, context, consentState, timestamp } = payload;
  const status = "status" in payload ? payload.status : undefined;
  const errorCode = "errorCode" in payload ? payload.errorCode : undefined;

  const params: Record<string, unknown> = applyCommonMetadata(
    {
      form_id: formId,
      form_name: formName,
      status,
      error_code: errorCode,
    },
    context,
    consentState,
    timestamp
  );

  if (metadata) {
    Object.assign(params, metadata);
  }

  emitEvent(eventName, params);
}
