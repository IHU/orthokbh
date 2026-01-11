const COOKIE_PREFERENCES_STORAGE_KEY = "uslu.cookie.preferences";
const COOKIE_PREFERENCES_EVENT = "cookie-preferenceschange";

export type CookiePreferences = {
  statistics: boolean;
  marketing: boolean;
};

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  statistics: false,
  marketing: false,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parsePreferences(serialized: string | null): CookiePreferences | null {
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized) as Partial<CookiePreferences> | null;
    return {
      statistics: Boolean(parsed?.statistics),
      marketing: Boolean(parsed?.marketing),
    };
  } catch (error) {
    console.warn("Unable to parse cookie preferences", error);
    return null;
  }
}

export function readCookiePreferences(): CookiePreferences {
  if (!isBrowser()) {
    return DEFAULT_COOKIE_PREFERENCES;
  }

  try {
    const stored = window.localStorage.getItem(COOKIE_PREFERENCES_STORAGE_KEY);
    return parsePreferences(stored) ?? DEFAULT_COOKIE_PREFERENCES;
  } catch (error) {
    console.warn("Unable to read cookie preferences", error);
    return DEFAULT_COOKIE_PREFERENCES;
  }
}

export function writeCookiePreferences(preferences: CookiePreferences): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      COOKIE_PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences)
    );
    window.dispatchEvent(
      new CustomEvent(COOKIE_PREFERENCES_EVENT, { detail: preferences })
    );
  } catch (error) {
    console.warn("Unable to store cookie preferences", error);
  }
}

export function onCookiePreferencesChange(
  listener: (preferences: CookiePreferences) => void
): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<CookiePreferences | null>;
    listener(custom.detail ?? readCookiePreferences());
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === COOKIE_PREFERENCES_STORAGE_KEY) {
      listener(parsePreferences(event.newValue) ?? DEFAULT_COOKIE_PREFERENCES);
    }
  };

  window.addEventListener(COOKIE_PREFERENCES_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(COOKIE_PREFERENCES_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

export {
  COOKIE_PREFERENCES_EVENT,
  COOKIE_PREFERENCES_STORAGE_KEY,
};
