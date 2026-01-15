import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import { Header } from "@ihu/umbraco-components";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileNav } from "@/components/mobile-nav";
import { DesktopNav } from "@/components/desktop-nav";
import {
  ContentContentModel,
  ContentService,
  HomeContentResponseModel,
  HomePropertiesModel,
  IApiContentModelBase,
} from "@ihu/umbraco-components/dist/api/umbraco";
import { Footer } from "@/components";
import { cn } from "@/lib/utils";
import { fetchContentChildren } from "@/lib/navigation";
import { buildUmbracoMediaUrl } from "@/lib/media";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AnalyticsProvider } from "@/components/analytics/use-analytics-context";
import { MarketingTags } from "@/components/analytics/marketing-tags";
import type { AnalyticsPageContext } from "@/lib/analytics/schema";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/jsonld";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
  fallback: ["-apple-system", "sans-serif"],
  variable: "--font-body",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
  fallback: ["Georgia", "serif"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "Uslu Solutions - Umbraco Components",
  description: "Next.js integration with Umbraco CMS",
  icons: {
    icon: "/favicon/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
const data = await fetchContent();

async function fetchContent(): Promise<HomeContentResponseModel | null> {
  try {
    const apiKey = process.env.NEXT_APP_UMBRACO_SITE_API_KEY!;
    const startItem = process.env.NEXT_APP_UMBRACO_START_ITEM!;

    const response = await ContentService.getContentItemById20({
      id: startItem,
      apiKey: apiKey,
      expand: "properties[navigations[properties[visibleToNavigation]]]",
    });

    if (!response) {
      console.error("No response from API");
      return null;
    }

    const content = response as HomeContentResponseModel;
    return content;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const properties = data?.properties as HomePropertiesModel;
  const logoUrl = buildUmbracoMediaUrl(properties?.logo?.[0]?.url);
  if (!properties?.navigations?.length) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <main>{children}</main>
        </body>
      </html>
    );
  }

  // Filter out items that are not visible
  const visibleItems = properties?.navigations?.filter(
    (item) => (item as ContentContentModel).properties?.visibleToNavigation
  );

  // For each parent item, fetch its children
  const navigationWithChildren: Array<
    IApiContentModelBase & { children?: IApiContentModelBase[] }
  > = [];

  for (const parentItem of visibleItems) {
    const children = await fetchContentChildren(parentItem.id);
    navigationWithChildren.push({
      ...parentItem,
      children: children,
    });
  }

  // If no data is available, render a basic layout
  if (!data) {
    return (
      <html lang="da" suppressHydrationWarning={true}>
        <head>
          <title>Service Unavailable</title>
        </head>
        <body>
          <main>{children}</main>
        </body>
      </html>
    );
  }

  const pageContext: AnalyticsPageContext = {
    pagePath: "/",
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${lora.variable} light theme-green`}
    >
      <body
        className={cn(
          manrope.className,
          "min-h-screen bg-background font-body antialiased flex flex-col"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          disableTransitionOnChange
          manualTheme={{ mode: "light", colorTheme: "green" }}
          disableToggle={true}
        >
          <AnalyticsProvider value={pageContext}>
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
            <Suspense fallback={null}>
              <MarketingTags />
            </Suspense>
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <Header
              logo={
                <span className="text-2xl font-bold text-gray-900">
                  Ortopædkirurgisk Klinik ved Søerne
                </span>
              }
              navigation={navigationWithChildren.map((item) => ({
                id: item.id,
                label: item.name || "",
                href: item.route?.path || "",
                children: item.children?.map((child) => ({
                  label: child.name || "",
                  href: child.route?.path || "",
                })),
              }))}
            >
              {({ data }) => (
                <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="logo">
                      <Link href="/" className="text-xl md:text-2xl font-bold">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            width={556}
                            height={56}
                            alt="Ortopædkirurgisk Klinik ved Søerne"
                          />
                        ) : (
                          <span>Ortopædkirurgisk Klinik ved Søerne</span>
                        )}
                      </Link>
                    </div>

                    {/* Desktop Navigation & Theme Toggle + Mobile Menu*/}
                    <div className="flex items-center gap-2">
                      <DesktopNav navigation={data.navigation} />
                      {/* Mobile Menu */}
                      <div className="md:hidden">
                        <MobileNav
                          navigation={data.navigation}
                          logo={logoUrl}
                        />
                      </div>
                    </div>
                  </div>
                </header>
              )}
            </Header>
            <main className="flex-1">{children}</main>
            {/* CTA Section disabled  */}
            {/* 
            <section className="bg-primary text-primary-foreground py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight">
              Venter du på behandling i det offentlige?
              </h2>
              <p className="mt-4 max-w-xl mx-auto">
              Du kan benytte det udvidede frie sygehusvalg, hvis du skal vente
              mere end 30 dage på udredning og behandling eller hvis du får
              ændret din operationsdato.
              </p>
              <Button asChild variant="secondary" size="lg" className="mt-8">
              <Link href="/contact">Book an Appointment</Link>
              </Button>
            </div>
            </section>
            */}
            <Footer
              className="border-t bg-muted/30"
              copyright={`© ${new Date().getFullYear()} Uslu Solutions ApS | All Rights Reserved`}
              links={properties?.services || []}
              quickLinks={properties?.quickLinks || []}
              workingHoursExtended={properties.workingHoursExtended || []}
              address={properties.address || ""}
              postalCode={properties.postalCode || ""}
              city={properties.city || ""}
              email={properties.email || ""}
              cvr={properties.cvr || ""}
              phone={properties.phoneNumber || ""}
              footerBottomBarLinks={properties?.policyLinks || []}
              properties={properties}
            />
            <CookieConsent />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
