"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsConfig } from "@/lib/analytics";
import {
  hasAnalyticsConsent,
  onAnalyticsConsentChange,
} from "@/lib/analytics/consent";

const { enabled, measurementId, crossDomainDomains } = analyticsConfig;
const linkerConfig =
  crossDomainDomains && crossDomainDomains.length > 0
    ? `, linker: { domains: ${JSON.stringify(crossDomainDomains)} }`
    : "";

export function GoogleAnalytics(): JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setHasConsent(hasAnalyticsConsent());

    const unsubscribe = onAnalyticsConsentChange((state) => {
      setHasConsent(state === "granted");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!enabled || !measurementId || !hasConsent) {
      return;
    }

    const pagePath = search ? `${pathname}?${search}` : pathname;

    window.gtag?.("config", measurementId, {
      page_path: pagePath,
    });
  }, [enabled, hasConsent, measurementId, pathname, search]);

  if (!enabled || !measurementId || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false${linkerConfig} });
        `}
      </Script>
    </>
  );
}
