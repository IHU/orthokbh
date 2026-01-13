"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { Switch } from "@/components/atoms/ui/switch";
import {
  onAnalyticsConsentChange,
  readStoredConsent,
  setAnalyticsConsent,
} from "@/lib/analytics/consent";
import {
  DEFAULT_COOKIE_PREFERENCES,
  readCookiePreferences,
  writeCookiePreferences,
} from "@/lib/consent/preferences";
import type { CookiePreferences } from "@/lib/consent/preferences";
import Link from "next/dist/client/link";

export function CookieConsent(): JSX.Element | null {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    DEFAULT_COOKIE_PREFERENCES
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialPreferences = readCookiePreferences();
    setPreferences(initialPreferences);

    const storedConsent = readStoredConsent();

    if (storedConsent === "granted") {
      setPreferences((current) => ({ ...current, statistics: true }));
      setBannerVisible(false);
    } else if (storedConsent === "denied") {
      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }

    const unsubscribe = onAnalyticsConsentChange((state) => {
      if (state === "granted") {
        setPreferences((current) => ({ ...current, statistics: true }));
        setBannerVisible(false);
      } else if (state === "denied") {
        setPreferences((current) => ({ ...current, statistics: false }));
        setBannerVisible(false);
      } else {
        setBannerVisible(true);
      }
    });

    setReady(true);

    return unsubscribe;
  }, []);

  if (!ready) {
    return null;
  }

  const showPreferencesDialog = () => {
    setDialogOpen(true);
    setBannerVisible(false);
  };

  const handleAcceptAll = () => {
    const nextPreferences: CookiePreferences = {
      statistics: true,
      marketing: true,
    };
    setPreferences(nextPreferences);
    writeCookiePreferences(nextPreferences);
    setAnalyticsConsent("granted");
    setDialogOpen(false);
    setBannerVisible(false);
  };

  const handleRejectAll = () => {
    const nextPreferences: CookiePreferences = {
      statistics: false,
      marketing: false,
    };
    setPreferences(nextPreferences);
    writeCookiePreferences(nextPreferences);
    setAnalyticsConsent("denied");
    setDialogOpen(false);
    setBannerVisible(false);
  };

  const handleSavePreferences = () => {
    writeCookiePreferences(preferences);

    if (preferences.statistics) {
      setAnalyticsConsent("granted");
      setBannerVisible(false);
    } else {
      setAnalyticsConsent("denied");
      setBannerVisible(false);
    }

    setDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (open) {
      setBannerVisible(false);
      return;
    }

    const stored = readStoredConsent();
    setBannerVisible(stored === null);
  };

  return (
    <>
      {bannerVisible ? (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border bg-background/95 p-6 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                  Hej! Vi bruger cookies 🍪
                </h2>
                <p className="text-sm text-muted-foreground">
                  Vi og vores partnere bruger cookies til funktion, statistik og
                  markedsføring. Ved at klikke &quot;Accepter alle&quot; giver
                  du samtykke til alle formål. Du kan også vælge specifikke
                  formål og gemme dine indstillinger. Du kan til enhver tid
                  trække dit samtykke tilbage via ikonet nederst til venstre.
                </p>
                <p className="text-sm text-muted-foreground">
                  Læs mere i vores{" "}
                  <Link className="underline" href="/cookiepolitik">
                    cookie-
                  </Link>{" "}
                  og{" "}
                  <Link className="underline" href="/privatlivspolitik">
                    privatlivspolitik
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="default" onClick={handleAcceptAll}>
                    Accepter alle
                  </Button>
                  <Button variant="secondary" onClick={handleRejectAll}>
                    Afvis alle
                  </Button>
                </div>
                <Button variant="ghost" onClick={showPreferencesDialog}>
                  Administrer indstillinger
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-6 left-6 z-[55] flex flex-col gap-2">
          <Button
            variant="ghost"
            onClick={showPreferencesDialog}
            className="border bg-background/90 backdrop-blur"
          >
            Cookies
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Samtykke- og cookieindstillinger</DialogTitle>
            <DialogDescription>
              Vi bruger cookies og lignende teknologier til at forbedre din
              oplevelse, analysere trafik og målrette relevant markedsføring.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <section className="rounded-xl border p-4">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Nødvendige cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Nødvendige for at siden fungerer korrekt og kan ikke
                    fravælges.
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
                  Altid aktiv
                </span>
              </header>
            </section>
            <section className="rounded-xl border p-4">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Statistiske cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Hjælper os med at forstå hvordan websitet bliver brugt, så
                    vi kan forbedre oplevelsen.
                  </p>
                </div>
                <Switch
                  checked={preferences.statistics}
                  onCheckedChange={(checked) =>
                    setPreferences((current) => ({
                      ...current,
                      statistics: Boolean(checked),
                    }))
                  }
                  aria-label="Aktivér statistiske cookies"
                />
              </header>
            </section>
            <section className="rounded-xl border p-4">
              <header className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Markedsføringscookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Bruges til at vise relevante annoncer og spore brugeradfærd
                    på tværs af websites.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences((current) => ({
                      ...current,
                      marketing: Boolean(checked),
                    }))
                  }
                  aria-label="Aktivér markedsføringscookies"
                />
              </header>
            </section>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button variant="ghost" onClick={handleRejectAll}>
              Afvis alle
            </Button>
            <Button variant="default" onClick={handleSavePreferences}>
              Gem indstillinger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
