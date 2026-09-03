/* =============================================================================
   COOKIE / STORAGE CONSENT
   -----------------------------------------------------------------------------
   The banner is not decoration. The choice made in it changes what the site
   actually does:

     accepted  the booking form remembers what you typed — name, email, phone,
               house, dates, guests — so a half-finished enquiry survives a
               reload, and your sent requests stay in this browser.
     declined  nothing is written, and anything already written is deleted on
               the spot. The form still works; it just forgets you.

   There is no analytics, no advertising pixel and no third-party script on this
   site, so those categories are not offered. Claiming to switch off something
   that was never on would be theatre.
   ========================================================================== */

export type ConsentValue = "accepted" | "declined";
export type ConsentState = ConsentValue | "unset";

const KEY = "swarma.consent.v1";
export const CONSENT_EVENT = "swarma:consent";

/** Wiped the moment consent is withdrawn. */
const OWNED_KEYS = ["swarma.booking-draft.v1", "swarma.booking-requests.v1"];

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "accepted" || raw === "declined" ? raw : "unset";
  } catch {
    // Private mode or blocked site data. "Not asked, and cannot store anyway."
    return "unset";
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, value);
    if (value === "declined") {
      for (const key of OWNED_KEYS) window.localStorage.removeItem(key);
    }
  } catch {
    /* nothing was stored either, which is consistent */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function storageAllowed(): boolean {
  return readConsent() === "accepted";
}
