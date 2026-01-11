import { hasAnalyticsConsent } from "@/lib/analytics/consent";

const rawAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
const rawMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const rawMarketingTags = process.env.NEXT_PUBLIC_MARKETING_TAGS ?? "";
const rawMetaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const rawLinkedInPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "";
const rawLinkerDomains = process.env.NEXT_PUBLIC_GA_LINKER_DOMAINS ?? "";

const parsedEnabled = rawAnalyticsEnabled === "true" || rawAnalyticsEnabled === "1";
const measurementId = (rawMeasurementId ?? "").trim();

const marketingTags = rawMarketingTags
  .split(",")
  .map((tag) => tag.trim())
  .filter((tag) => tag.length > 0);

const crossDomainDomains = rawLinkerDomains
  .split(",")
  .map((domain) => domain.trim())
  .filter((domain) => domain.length > 0);

export const analyticsConfig = {
  enabled: Boolean(parsedEnabled && measurementId.length > 0),
  measurementId,
  marketing: {
    enabledTags: marketingTags,
    metaPixelId: rawMetaPixelId.trim(),
    linkedInPartnerId: rawLinkedInPartnerId.trim(),
  },
  crossDomainDomains,
};

export function shouldLoadAnalytics(): boolean {
  if (!analyticsConfig.enabled) {
    return false;
  }

  try {
    return hasAnalyticsConsent();
  } catch (error) {
    console.warn("Analytics consent check failed", error);
    return false;
  }
}
