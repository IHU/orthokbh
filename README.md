# Uslu Solutions – Umbraco Powered Next.js

Modern Next.js application that renders Umbraco CMS content through the `@ihu/umbraco-components` SDK and a custom library of UI blocks.

## Overview

- Next.js 16 App Router site that sources navigation, layout chrome, and page content from Umbraco Delivery API.
- Global client configuration in `src/lib/umbracoConfig.ts` keeps API credentials and endpoints consistent across the app.
- Block-driven rendering pipeline (`ContentTemplate` → `BlockRenderer`) maps Umbraco block types to in-house React components for tailored presentation.
- Responsive header, desktop/mobile navigation, theme switching, and a rich component catalogue styled with Tailwind CSS and Radix primitives.

## Tech Stack

- Next.js 16 with React 18, TypeScript, and App Router.
- Tailwind CSS (including `tailwindcss-animate` and `@tailwindcss/typography`) plus custom design tokens defined in CSS variables.
- Radix UI components and Lucide icons for accessible, composable UI elements.
- `@ihu/umbraco-components` for typed Delivery API clients, block wrappers, and content models.
- Vitest for unit testing and Turbopack dev server running over HTTPS.

## Project Structure

```
src/
  app/
    layout.tsx            # Root layout; fetches global content and navigation from Umbraco
    page.tsx              # Home route; loads page blocks and renders them through ContentTemplate
    [...slug]/page.tsx    # Catch-all route for dynamic Umbraco pages
    test/page.tsx         # Design system showcase and layout experiments
  components/
    atoms/                # Foundational UI pieces (buttons, dropdowns, sheet, etc.)
    organisms/            # Domain blocks mapped from Umbraco content
    templates/            # Template-level renderers (e.g. ContentTemplate)
  hooks/                  # Shared React hooks (e.g. toast utilities)
  lib/                    # Umbraco config, block renderer, navigation helpers
certificates/             # Local HTTPS cert/key used by the dev server
next.config.ts            # Remote image domains and dev optimisations
tailwind.config.js        # Tailwind theme and content scanning configuration
```

## Configuration

Create an `.env.local` file at the repository root with the Umbraco Delivery API credentials and site metadata settings:

```
NEXT_APP_UMBRACO_BASE_URL=https://your-umbraco-instance
NEXT_APP_UMBRACO_SITE_API_KEY=your-api-key
NEXT_APP_UMBRACO_START_ITEM=content-guid
NEXT_PUBLIC_UMBRACO_MEDIA_BASE_URL=https://your-umbraco-instance
NEXT_PUBLIC_SITE_URL=https://www.your-production-domain.com
```

These values are consumed in `src/lib/umbracoConfig.ts`, `src/app/layout.tsx`, and `src/lib/navigation.ts` to configure the generated API clients. Default fallbacks exist for local development but must be replaced for real content.

`NEXT_PUBLIC_SITE_URL` is required for generating canonical URLs, Open Graph metadata, and sitemap entries. Supply the fully qualified production origin (including scheme) without a trailing slash.

Site-wide JSON-LD lives under `src/components/seo/jsonld.tsx`. The root layout injects `Organization` and `WebSite` schemas automatically, while individual pages render `PageJsonLd`/`BreadcrumbJsonLd` with Umbraco content metadata.

The analytics loader respects the following toggles:

```
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_LINKER_DOMAINS=
NEXT_PUBLIC_MARKETING_TAGS=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=
```

Set `NEXT_PUBLIC_ANALYTICS_ENABLED` to `true` only after providing a valid GA4 measurement ID and confirming consent requirements. When enabled, the root layout injects the GA4 script via `GoogleAnalytics` with delayed page view dispatching so route changes are tracked in the App Router.

- `NEXT_PUBLIC_GA_LINKER_DOMAINS` accepts a comma-separated list of domains for GA4 cross-domain linking (e.g., `uslu.dk,uslu.se`).
- `NEXT_PUBLIC_MARKETING_TAGS` toggles opt-in marketing pixels (`meta`, `linkedin`, etc.). Provide the matching IDs via `NEXT_PUBLIC_META_PIXEL_ID` and `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` when those tags are enabled. Scripts only load when visitors grant marketing consent in the cookie banner.

Use the helpers in `src/lib/analytics/events.ts` to emit structured GA4 events:

```ts
import { trackBlockImpression, trackConversion } from "@/lib/analytics/events";

trackBlockImpression({ blockId: "hero:primary", blockType: "hero" });
trackConversion({ action: "appointment_request", label: "Contact form" });
```

### Consent & Data Layer

- Manage consent through `src/lib/analytics/consent.ts`. Call `setAnalyticsConsent("granted")` once a user opts in, or `setAnalyticsConsent("denied")`/`clearAnalyticsConsent()` when they opt out.
- The `GoogleAnalytics` component delays injecting GA4 until consent is granted, preventing accidental hits before approval.
- Consent changes dispatch a global `analytics-consentchange` event and update `localStorage` (`uslu.analytics.consent`), allowing custom banners or CMPs to stay in sync.
- GA4 runs on the standard `window.dataLayer`; you can push additional events by calling `window.dataLayer.push({...})` after consent.
- The default UI is implemented in `src/components/consent/cookie-consent.tsx`, mirroring the banner/settings modal shown in the stakeholder mockups. Buttons call the helpers above and persist user preferences under `uslu.cookie.preferences`.

See `docs/phase-3-analytics-qa.md` for the full checklist covering consent flows, navigation events, block impressions, CTA tracking, form lifecycle, and marketing tags.

> The dev scripts set `NODE_TLS_REJECT_UNAUTHORIZED=0` so self-signed Umbraco certificates do not block API calls. Update this if your instance uses a trusted certificate chain.

## Getting Started

```bash
npm install            # Install dependencies
npm run dev            # Start Turbopack dev server (HTTPS by default on port 3000)
npm run build          # Create a production build
npm start              # Serve the production build
npm run test           # Execute the Vitest suite
```

The dev server runs with `--experimental-https`. Trust the certificates in `certificates/` (or update the CLI flags) if your browser warns about the connection.

## Rendering Flow

1. `src/app/layout.tsx` fetches the start item defined in Umbraco, expands navigation data, and hydrates the Header, DesktopNav, and MobileNav components. Child routes receive the layout shell with theme support and structured footer content.
2. `src/app/page.tsx` retrieves the current page via `ContentService.getContentItemByPath20`, then hands block data to `ContentTemplate`.
3. `src/components/templates/ContentTemplate.tsx` filters valid blocks and delegates to `BlockRenderer`.
4. `src/lib/BlockRenderer.tsx` chooses both the generated block wrapper from `@ihu/umbraco-components` and the bespoke UI component (e.g. `Hero`, `Feature`, `Footer`), ensuring each block renders with project-specific styling while preserving typed data access.

Extend the experience by adding new entries to `blockMap`/`blockUIMap` and corresponding React components inside `src/components/organisms`.

## Assets & Styling Notes

- Remote images must match the patterns declared in `next.config.ts` (`unsplash.com`, `flowbite.s3.amazonaws.com`, Umbraco hostnames, etc.). Update this list when introducing new asset providers.
- Tailwind CSS scans `src/**/*` (plus the optional `packages/core` path) for class usage. If you relocate or add directories, update `tailwind.config.js` accordingly.
- Theme variables live in `src/app/globals.css`. Adjust CSS custom properties there to change the global design language.

## Troubleshooting

- Missing navigation items usually indicate `visibleToNavigation` is unset in Umbraco. The helper `fetchContentChildren` filters out hidden items by design.
- If API requests fail in development, confirm the `.env.local` settings and whether your Umbraco certificate is trusted. Removing the `NODE_TLS_REJECT_UNAUTHORIZED` override is recommended once you have valid certificates.
- Hydration mismatches around media components generally mean the client cannot resolve Umbraco asset URLs. Ensure `NEXT_PUBLIC_UMBRACO_MEDIA_BASE_URL` points at the same origin returned by the Delivery API so both server and client build identical markup.
