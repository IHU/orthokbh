"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsConfig } from "@/lib/analytics";
import {
  onCookiePreferencesChange,
  readCookiePreferences,
} from "@/lib/consent/preferences";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
    _linkedin_data_partner_ids?: string[];
  }
}

const marketingConfig = analyticsConfig.marketing;

export function MarketingTags(): JSX.Element | null {
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    setHasMarketingConsent(readCookiePreferences().marketing);
    const unsubscribe = onCookiePreferencesChange((preferences) => {
      setHasMarketingConsent(Boolean(preferences.marketing));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (
      !hasMarketingConsent ||
      typeof window === "undefined" ||
      typeof window.fbq !== "function" ||
      !marketingConfig.enabledTags.includes("meta")
    ) {
      return;
    }

    window.fbq("track", "PageView");
  }, [hasMarketingConsent, pathname, search]);

  if (!marketingConfig.enabledTags.length) {
    return null;
  }

  if (!hasMarketingConsent) {
    return null;
  }

  return (
    <>
      {marketingConfig.enabledTags.includes("meta") &&
      marketingConfig.metaPixelId ? (
        <MetaPixel pixelId={marketingConfig.metaPixelId} />
      ) : null}
      {marketingConfig.enabledTags.includes("linkedin") &&
      marketingConfig.linkedInPartnerId ? (
        <LinkedInInsight partnerId={marketingConfig.linkedInPartnerId} />
      ) : null}
    </>
  );
}

function MetaPixel({ pixelId }: { pixelId: string }): JSX.Element {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
          }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

function LinkedInInsight({ partnerId }: { partnerId: string }): JSX.Element {
  return (
    <>
      <Script id="linkedin-insight-init" strategy="afterInteractive">
        {`
          window._linkedin_partner_id='${partnerId}';
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push('${partnerId}');
        `}
      </Script>
      <Script id="linkedin-insight-loader" strategy="afterInteractive">
        {`
          (function(){
            var s=document.getElementsByTagName('script')[0];
            var b=document.createElement('script');
            b.type='text/javascript';
            b.async=true;
            b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';
            s.parentNode.insertBefore(b,s);
          })();
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
