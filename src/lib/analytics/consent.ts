const CONSENT_STORAGE_KEY = "uslu.analytics.consent";
const CONSENT_EVENT = "analytics-consentchange";

type ConsentState = "granted" | "denied";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseConsent(value: string | null): ConsentState | null {
  if (value === "granted" || value === "denied") {
    return value;
  }

  return null;
}

export function readStoredConsent(): ConsentState | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return parseConsent(raw);
  } catch (error) {
    console.warn("Unable to read analytics consent from storage", error);
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readStoredConsent() === "granted";
}

export function setAnalyticsConsent(state: ConsentState): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, state);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  } catch (error) {
    console.warn("Unable to persist analytics consent", error);
  }
}

export function clearAnalyticsConsent(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  } catch (error) {
    console.warn("Unable to clear analytics consent", error);
  }
}

export function onAnalyticsConsentChange(listener: (state: ConsentState | null) => void): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ConsentState | null>;
    listener(customEvent.detail ?? readStoredConsent());
  };

  window.addEventListener(CONSENT_EVENT, handler);

  const storageHandler = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) {
      listener(parseConsent(event.newValue));
    }
  };

  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(CONSENT_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

export { CONSENT_STORAGE_KEY, CONSENT_EVENT };
