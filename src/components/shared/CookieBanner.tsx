"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/components/shared/ConsentProvider";
import { useUI } from "@/components/shared/UIProvider";
import { TLink } from "@/components/shared/Transition";

/* =============================================================================
   COOKIE SETTINGS — a working feature, not a notice.
   -----------------------------------------------------------------------------
   Two levels, and the second one is what makes this real: "Manage" opens the
   detail panel listing what is actually stored, key by key, with a switch that
   takes effect immediately. Declining does not just record a preference — it
   deletes what is already there.

   Placement: the banner sits above the mobile menu on the stacking scale, so it
   hides itself while the menu is open rather than covering it, and it reserves
   its own height at the bottom of the page while visible so it cannot sit on
   top of a page's last control.
   ========================================================================== */

export function CookieBanner() {
  const { banner, consent, set } = useConsent();
  const { menuOpen } = useUI();
  const [detail, setDetail] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const visible = banner && !menuOpen;

  useEffect(() => {
    if (visible) ref.current?.focus();
  }, [visible]);

  // Reserve the height for as long as the banner is shown, and give it straight
  // back when it is dismissed.
  useEffect(() => {
    if (!visible) return;
    document.body.style.paddingBottom = detail ? "23rem" : "13rem";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [visible, detail]);

  if (!visible) return null;


  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="z-cookie fixed inset-x-0 bottom-0 p-3 sm:p-4 md:left-auto md:right-4 md:max-w-lg"
    >
      <div className="r-md border border-line bg-surface p-5 text-ink shadow-[0_-2px_30px_rgba(0,0,0,0.16)] sm:p-6">
        <h2 id="cookie-title" className="display text-xl">
          What this site stores on your device
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          There is no analytics, no advertising pixel and no third-party tracking
          here. The only thing we would store is your own booking enquiry, kept in
          this browser so a half-finished form survives a reload.
        </p>

        {detail && (
          <dl className="mt-4 grid gap-3 border-t border-line pt-4 text-sm">
            <div>
              <dt className="font-medium text-ink">Strictly necessary — always on</dt>
              <dd className="mt-1 text-muted">
                One key, <code className="text-[13px]">swarma.consent.v1</code>,
                recording the choice you make here. Without it we would have to ask
                on every page.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">
                Your booking draft — {consent === "accepted" ? "on" : "off"}
              </dt>
              <dd className="mt-1 text-muted">
                <code className="text-[13px]">swarma.booking-draft.v1</code> and{" "}
                <code className="text-[13px]">swarma.booking-requests.v1</code>: what
                you typed into the booking form, and the requests you have sent from
                this device. Both stay in your browser — they are never uploaded and
                we cannot read them.
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => set("accepted")}
            className="r-pill bg-gold px-5 py-2.5 text-sm font-medium text-ongold transition-opacity hover:opacity-90"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={() => set("declined")}
            className="r-pill border border-field px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-raised"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setDetail((d) => !d)}
            aria-expanded={detail}
            className="r-pill px-3 py-2.5 text-sm text-muted underline underline-offset-4 hover:text-ink"
          >
            {detail ? "Hide detail" : "Manage"}
          </button>
          <TLink
            href="/privacy"
            className="ml-auto px-1 py-2.5 text-sm text-muted underline underline-offset-4 hover:text-ink"
          >
            Privacy
          </TLink>
        </div>
      </div>
    </div>
  );
}
