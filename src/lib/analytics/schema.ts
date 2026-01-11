export type ConsentState = "granted" | "denied";

export interface AnalyticsPageContext {
  pagePath: string;
  pageTitle?: string;
  nodeId?: string;
  nodeType?: string;
  locale?: string;
  siteSection?: string;
  routeSegments?: string[];
  canonicalUrl?: string;
}

export interface AnalyticsEventBase {
  context?: AnalyticsPageContext;
  timestamp?: number;
  consentState?: ConsentState;
}

export interface BlockImpressionPayload extends AnalyticsEventBase {
  blockId: string;
  blockType?: string;
  position?: number;
  variant?: string;
}

export interface NavigationInteractionPayload extends AnalyticsEventBase {
  action: "click" | "open" | "close";
  label: string;
  targetUrl?: string;
  menu?: "desktop" | "mobile" | "footer" | "cta";
  depth?: number;
}

export interface CtaInteractionPayload extends AnalyticsEventBase {
  action: string;
  label: string;
  destination?: string;
  blockId?: string;
}

export interface FormEventBasePayload extends AnalyticsEventBase {
  formId: string;
  formName?: string;
}

export interface FormViewPayload extends FormEventBasePayload {}

export interface FormStartPayload extends FormEventBasePayload {}

export interface FormSubmitPayload extends FormEventBasePayload {
  status: "success" | "error" | "abandoned";
  errorCode?: string;
}
