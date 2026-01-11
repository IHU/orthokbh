# Analytics Data Layer Schema

This document defines the shared event structure used for GA4 and any future marketing tags. All client-side instrumentation must adhere to these conventions so engineers and analysts can rely on consistent payloads.

## Global Context

Every analytics event extends the base context below:

```ts
interface AnalyticsPageContext {
  pagePath: string; // Normalized URL path (e.g. "/services")
  pageTitle?: string; // Display title if known
  nodeId?: string; // Umbraco content GUID
  nodeType?: string; // Umbraco document type alias
  locale?: string; // IETF language tag (e.g. "da-DK")
  siteSection?: string; // First path segment ("home" when root)
  routeSegments?: string[]; // Array of path segments for hierarchy analysis
  canonicalUrl?: string; // Absolute canonical URL used for metadata
}

interface AnalyticsEventBase {
  context: AnalyticsPageContext;
  timestamp?: number; // epoch ms for debugging
  consentState?: "granted" | "denied"; // snapshot when event fires
}
```

GA4 events should push `context` fields via `window.dataLayer.push({ ...context })` prior to emitting the specific event. When possible, capture `nodeId` and `nodeType` from Umbraco responses.

## Event Families

### 1. Page View

Emitted automatically by `GoogleAnalytics` after navigation:

```ts
interface PageViewEvent extends AnalyticsEventBase {
  event: "page_view";
}
```

`pagePath` should include search params if meaningful (`/services?id=123`).

### 2. Block Impression

Triggered when a block scrolls into view:

```ts
interface BlockImpressionEvent extends AnalyticsEventBase {
  event: "block_impression";
  blockId: string; // Stable identifier (e.g. "hero:primary")
  blockType?: string; // Component type ("hero", "ctaAction")
  position?: number; // Index within page
  variant?: string; // A/B variant label
}
```

### 3. Navigation Interaction

Click, hover, or menu toggles in header/footer/navigation:

```ts
interface NavigationEvent extends AnalyticsEventBase {
  event: "navigation_interaction";
  action: "click" | "open" | "close";
  label: string; // Visible text
  targetUrl?: string;
  menu?: "desktop" | "mobile" | "footer";
  depth?: number; // 0 = primary, 1 = child link
}
```

### 4. CTA Interaction

Buttons or links representing conversion CTAs:

```ts
interface CtaEvent extends AnalyticsEventBase {
  event: "cta_click";
  action: string; // Machine readable ID ("book_consultation")
  label: string; // User-facing label
  destination?: string; // URL or component ID
  blockId?: string; // Optional linkage to parent block
}
```

### 5. Form Lifecycle

```ts
interface FormEventBase extends AnalyticsEventBase {
  formId: string; // Stable form identifier ("contact")
  formName?: string; // Display name
}

interface FormViewEvent extends FormEventBase {
  event: "form_view";
}

interface FormStartEvent extends FormEventBase {
  event: "form_start";
}

interface FormSubmitEvent extends FormEventBase {
  event: "form_submit";
  status: "success" | "error" | "abandoned";
  errorCode?: string;
}
```

## Data Layer Usage

- All events are sent via `track*` helpers in `src/lib/analytics/events.ts`.
- Helpers should enrich payloads with the active `AnalyticsPageContext` before calling `window.gtag` or `dataLayer.push`.
- When consent is denied, helpers must no-op.
- GA4 parameters (`page_path`, `page_title`, `node_id`, `node_type`, `locale`, `site_section`, `route_segments`, `canonical_url`) are derived automatically from the page context when events are dispatched.

## Required Metadata Sources

| Field      | Source                                                       |
| ---------- | ------------------------------------------------------------ |
| `pagePath` | `usePathname()` and search params in the App Router          |
| `nodeId`   | Umbraco responses in page loaders (`layout`, dynamic routes) |
| `nodeType` | `contentTypeAlias` or equivalent from Umbraco API            |
| `locale`   | `params.lang` or `intl` config if multi-language             |
| `blockId`  | Unique key when mapping blocks (e.g., alias + index)         |
| `formId`   | Component-level constant                                     |

## Next Steps

1. Implement a context provider that exposes `AnalyticsPageContext` to client components.
2. Extend existing event helpers (`trackBlockImpression`, etc.) to accept the new payload shape.
3. Instrument navigation, CTA, and forms to emit events using these interfaces.
4. Add automated or manual QA scripts to verify events in GA4 DebugView.

## Marketing Tags & Cross-Domain Tracking

- Marketing pixels load through `MarketingTags` once visitors opt into the marketing toggle inside the cookie banner. Set `NEXT_PUBLIC_MARKETING_TAGS` to a comma-separated list (`meta`, `linkedin`) and provide the corresponding IDs (`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`).
- GA4 cross-domain support reads `NEXT_PUBLIC_GA_LINKER_DOMAINS` and injects the linker configuration during analytics bootstrapping so sessions persist across trusted domains.
- The full validation process for Phase 3 instrumentation lives in `docs/phase-3-analytics-qa.md`.

### Configuring Marketing Pixels

1. Update `.env.local` (and production secrets) with the relevant variables:

```
NEXT_PUBLIC_MARKETING_TAGS=meta,linkedin
NEXT_PUBLIC_META_PIXEL_ID=<your-meta-pixel-id>
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=<your-linkedin-partner-id>
```

- Remove entries from `NEXT_PUBLIC_MARKETING_TAGS` to disable specific pixels (e.g., set to `meta` only).

2. **Meta Pixel ID:**

- Open Facebook Events Manager → Data Sources → select the Pixel used for the site.
- Copy the numeric **Pixel ID** shown in the Setup instructions and paste it into `NEXT_PUBLIC_META_PIXEL_ID`.

3. **LinkedIn Partner ID:**

- In LinkedIn Campaign Manager, choose the account → `Account Assets` → `Insight Tag`.
- The **Partner ID** appears in the setup modal/snippet (a numeric string). Use that value for `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`.

4. Redeploy or restart the Next.js server after updating environment variables so the new settings propagate.
