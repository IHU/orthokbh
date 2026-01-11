# Phase 3 – Analytics QA Checklist

This checklist validates the advanced analytics instrumentation introduced in Phase 3. Complete the steps before releasing to production and whenever significant content or analytics changes ship.

---

## 1. Environment & Configuration

- [ ] Review `.env.local` (or hosting config) for:
  - `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
  - Valid `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - `NEXT_PUBLIC_GA_LINKER_DOMAINS` populated when cross-domain tracking is required
  - `NEXT_PUBLIC_MARKETING_TAGS` matches deployed pixels (`meta`, `linkedin`, …)
  - Corresponding pixel IDs provided (`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`, etc.)
- [ ] Confirm consent-related localStorage keys are **not** pre-filled prior to testing (`uslu.analytics.consent`, `uslu.cookie.preferences`).

## 2. Consent Flows

- [ ] First-visit banner appears with “Accepter alle”, “Afvis alle”, and “Administrer indstillinger”.
- [ ] “Accepter alle” stores `statistics=true`, `marketing=true`, hides the banner, and loads GA4 + marketing tags.
- [ ] “Afvis alle” stores both toggles `false`, hides the banner, and **does not** load GA4 or marketing tags.
- [ ] “Administrer indstillinger” opens the dialog and preserves toggle state between openings.
- [ ] Changes made via “Gem indstillinger” update localStorage and adjust loaded scripts immediately (GA4 should unload/stop emitting when statistics are disabled).
- [ ] “Cookie-indstillinger” floating button remains accessible after consent and reopens the dialog with existing preferences.

## 3. GA4 Page Views & Context

- [ ] Accept statistics consent, then navigate between:
  - Home (`/`)
  - At least one dynamic page (`/[...slug]`)
  - Demo page (`/demo`)
- [ ] Confirm each navigation emits a single `page_view` in GA4 DebugView with:
  - `page_path` matching the rendered URL (including query string when present)
  - `page_title`, `node_id`, `node_type`, and `locale` populated from Umbraco content
  - `site_section`, `route_segments`, and `canonical_url` populated based on the resolved route
- [ ] Verify cross-domain linker parameters (`_gl`) appear on outbound links when `NEXT_PUBLIC_GA_LINKER_DOMAINS` is set.
- [ ] Validate structured data renders: open View Source and ensure JSON-LD scripts (`Organization`, `WebSite`, `WebPage`/`Article`, `BreadcrumbList`) are present with correct URLs. Optionally run the pages through Google's Rich Results Test.

## 4. Navigation Instrumentation

- [ ] Desktop header: primary and child link clicks fire `navigation_interaction` with `menu="desktop"`, correct `label`, `target_url`, and `depth`.
- [ ] Mobile nav: opening/closing the menu emits actions `open`/`close`; link taps emit `click` events with `menu="mobile"`.
- [ ] Footer quick links trigger `navigation_interaction` with `menu="footer"` (if instrumented).

## 5. Block Impression Observer

- [ ] Scroll through a page containing multiple content blocks.
- [ ] Each block records a single `block_impression` (use GA DebugView or log instrumentation) with `block_id`, `block_type`, and `position`.
- [ ] Confirm impressions stop firing when the block leaves/enters viewport repeatedly (debounced correctly).

## 6. CTA Tracking

- [ ] Interact with CTA components (`Hero`, `CtaAction`, footer CTAs, etc.).
- [ ] `cta_click` events fire with:
  - `action` (machine-readable ID)
  - `label` (user-facing copy)
  - `destination` or `block_id` when present
  - `context.page_path` matching the current route
- [ ] Ensure duplicate clicks within rapid succession behave as expected (either deduplicated or counted per requirement).

## 7. Form Lifecycle Events

- [ ] On first focus/input, `form_start` fires once per session for that form.
- [ ] Successful submission logs `form_submit` with `status="success"` and metadata `hasMessage` when a message is provided.
- [ ] Trigger a validation error to ensure `form_submit` fires with `status="error"`.
- [ ] `form_view` fires on mount with block linkage metadata (`block_id`).

## 8. Marketing Tags

> Applies when `NEXT_PUBLIC_MARKETING_TAGS` enables specific pixels.

- [ ] Accept full consent and confirm network requests load the relevant scripts:
  - Meta Pixel: `https://connect.facebook.net/…`
  - LinkedIn Insight: `https://snap.licdn.com/li.lms-analytics/insight.min.js`
- [ ] Denying marketing consent prevents those requests.
- [ ] Validate pixel-specific dashboards (Meta Events Manager, LinkedIn Campaign Manager) receive events during testing.

## 9. Regression & Error Monitoring

- [ ] Check browser console for warnings/errors related to analytics or consent during all flows.
- [ ] Validate `yarn build` logs only the expected self-signed certificate warnings (no TypeScript or runtime errors).
- [ ] If using Sentry or similar, confirm analytics instrumentation does not introduce new noisy logs.

## 10. Automation Hooks (Optional)

- [ ] Consider adding Playwright/Vitest integration tests that:
  - Mock consent states and assert `window.dataLayer` contents
  - Verify no analytics events fire when consent is denied
  - Ensure marketing scripts load only after marketing consent
- [ ] Document how to run automated analytics checks (if implemented) in `docs/automation.md` or equivalent.

---

**Completion:** All checklist items should pass before marking Phase 3 analytics instrumentation as production-ready.
