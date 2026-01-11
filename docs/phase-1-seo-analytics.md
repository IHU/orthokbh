# Phase 1 – SEO & Analytics Foundation

This guide summarizes what was delivered during Phase 1 and how to operate the new SEO and analytics features.

## 1. Canonical Metadata

- `src/lib/metadata.ts` centralizes canonical URL handling. The helpers are consumed in `src/app/page.tsx` and `src/app/[...slug]/page.tsx` via `generateMetadata`.
- `NEXT_PUBLIC_SITE_URL` must point at the public origin (e.g. `https://www.uslu.dk`). Fallbacks exist for local dev, but production deployments require a valid value.
- Middleware (`middleware.ts`) enforces lowercase, trailing-slash-free URLs to prevent duplicate content.

## 2. Metadata Routes

- `src/app/robots.ts` and `src/app/sitemap.ts` now auto-generate from Umbraco navigation data. Ensure navigation visibility flags are correct in Umbraco so pages appear in the sitemap.
- Validate the outputs by visiting `/robots.txt` and `/sitemap.xml` once the site is running. Both routes respect the configured canonical host.

## 3. Core Web Vitals Baseline

- Fonts self-host via `next/font` in `src/app/layout.tsx`; external Google Fonts scripts were removed.
- Console noise/log spam from block components and navigation helpers has been cleaned up.

## 4. Analytics Bootstrapping

### Environment Variables

Add these to `.env.local` (and production secrets):

```
NEXT_PUBLIC_SITE_URL=https://www.uslu.dk
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_APP_UMBRACO_BASE_URL=...
NEXT_APP_UMBRACO_SITE_API_KEY=...
NEXT_APP_UMBRACO_START_ITEM=...
NEXT_PUBLIC_UMBRACO_MEDIA_BASE_URL=...
```

Set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` only after you provide a valid GA4 measurement ID and ship consent UI.

### Loading Logic

- `src/lib/analytics.ts` reads env toggles and defers to consent.
- `src/components/analytics/google-analytics.tsx` injects GA4 scripts once `setAnalyticsConsent("granted")` has been invoked. Route transitions trigger `gtag("config", { page_path })` to record virtual page views.

### Event Helpers

- Use `trackBlockImpression` and `trackConversion` from `src/lib/analytics/events.ts` to send custom events.

  ```ts
  import {
    trackBlockImpression,
    trackConversion,
  } from "@/lib/analytics/events";

  trackBlockImpression({ blockId: "hero:primary", blockType: "hero" });
  trackConversion({ action: "appointment_request", label: "Footer CTA" });
  ```

- Both helpers guard against running before GA is ready.

### Consent Management

- Consent storage keys:
  - `uslu.analytics.consent` – `granted` or `denied` to gate GA scripts.
  - `uslu.cookie.preferences` – stores category toggles.
- Helpers in `src/lib/analytics/consent.ts`:

  - `setAnalyticsConsent("granted" | "denied")`
  - `clearAnalyticsConsent()`
  - `onAnalyticsConsentChange(listener)` – subscribe to global consent changes.

- UI implementation: `src/components/consent/cookie-consent.tsx` renders the banner and settings dialog. It mirrors stakeholder copy, persists preferences, and keeps a "Cookie-indstillinger" button accessible after dismissal.

## 5. Verification Checklist

1. **Environment** – Confirm all env vars are populated and not committed to git.
2. **Routes** – Open `/robots.txt` and `/sitemap.xml`. Entries should use the canonical host.
3. **Middleware** – Visit a mixed-case URL (e.g. `/Demo/`) and ensure it redirects to lowercase without trailing slash.
4. **Fonts** – Check Network tab for the absence of Google Fonts CDN requests; fonts should load from `_next/static/media`.
5. **Analytics** – Enable analytics and consent, then:
   - Watch for `gtag/js` network requests after accepting cookies.
   - Use GA4 DebugView or Tag Assistant to see `page_view`, `block_impression`, etc.
6. **Cookie UI** – Verify:
   - Banner appears on first visit.
   - "Administrer indstillinger" hides the banner and opens the dialog.
   - "Cookie-indstillinger" button persists bottom-left after acceptance.
   - Accepting/rejecting updates consent and hides the banner appropriately.
7. **Structured Data** – Run key URLs through Google's Rich Results Test and confirm `Organization`, `WebSite`, `WebPage`/`Article`, and `BreadcrumbList` JSON-LD payloads render without errors.

## 6. Next Steps (Phase 2+)

- Integrate marketing tags (e.g., Facebook Pixel) and tie them to the Marketing toggle.
- Expand analytics events for specific conversions (form submissions, bookings).
- Resolve Umbraco self-signed certificate warnings or set up trusted certs.
- Consider automated tests to ensure consent state persists across reloads.
