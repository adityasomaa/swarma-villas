"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { submitBooking } from "@/app/actions/booking";
import { DateField } from "@/components/form/DateField";
import { Listbox } from "@/components/form/Listbox";
import { useConsent } from "@/components/shared/ConsentProvider";
import { guestCountOptions, houseBySlug, houses } from "@/content/site";
import { validateBooking, FIELD_ORDER, type FieldErrors } from "@/lib/booking/schema";
import { bookingStore } from "@/lib/booking/store";
import { clsx } from "@/lib/clsx";
import { addDays, formatIDR, nightsBetween, parseISODate, pluralise, todayISO } from "@/lib/format";
import { templateFromPath } from "@/lib/templates";
import { bookingRequestUrl } from "@/lib/whatsapp";

/* =============================================================================
   BOOKING FORM
   -----------------------------------------------------------------------------
   Behaviour worth knowing about:

   - Failing validation NEVER clears a field and NEVER scrolls the page to the
     top. The first invalid control is focused where it stands. Losing eight
     fields of typing because of a mistyped email is how forms get abandoned.
   - The house can arrive pre-selected from a house page via `?house=`, so a
     guest who has already decided is one field further along.
   - Nights are derived, never entered. The check-out calendar will not even
     offer a date before check-in, and the schema rejects it a second time.
   - Everything is validated again on the server.
   - If the visitor allowed browser storage, the draft is restored on return. If
     they declined, nothing is written and nothing is read.

   The hand-off is WhatsApp, to the villa's WhatsApp number — which is a
   different number from the reservations phone line.
   ========================================================================== */

const DRAFT_KEY = "swarma.booking-draft.v1";

type Fields = {
  name: string;
  email: string;
  phone: string;
  house: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  notes: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  phone: "",
  house: "",
  checkIn: "",
  checkOut: "",
  guests: "2",
  notes: "",
};

export function BookingForm({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const template = templateFromPath(pathname);
  const { consent } = useConsent();

  /**
   * "Book this house" links carry `?house=<slug>`. Reading it here rather than
   * on the server is what keeps every contact page a static document: a page
   * that awaits searchParams has to render on demand, and its prefetch is then
   * cancelled from every page that links to it.
   */
  const fromUrl = searchParams.get("house");
  const initialHouse = fromUrl && houseBySlug(fromUrl) ? fromUrl : "";
  const initialCheckIn = safeDate(searchParams.get("checkIn"));
  const initialCheckOut = safeDate(searchParams.get("checkOut"));

  const [fields, setFields] = useState<Fields>(() => ({
    ...EMPTY,
    house: initialHouse,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut && initialCheckIn && initialCheckOut > initialCheckIn ? initialCheckOut : "",
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "checking" | "ready">("idle");
  const [handoff, setHandoff] = useState<{ url: string; nights: number } | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const restored = useRef(false);

  const nights = nightsBetween(fields.checkIn, fields.checkOut);
  const house = fields.house ? houseBySlug(fields.house) : undefined;

  /* ------------------------------------------------------------ draft I/O */

  useEffect(() => {
    if (restored.current || consent !== "accepted") return;
    restored.current = true;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Fields>;
      setFields((current) => ({
        ...current,
        ...parsed,
        // A choice made in the URL always beats a remembered one.
        house: initialHouse || parsed.house || current.house,
        // Never restore a date that has since gone past.
        checkIn: parsed.checkIn && parsed.checkIn >= todayISO() ? parsed.checkIn : current.checkIn,
        checkOut: parsed.checkOut && parsed.checkOut >= todayISO() ? parsed.checkOut : current.checkOut,
      }));
    } catch {
      /* corrupt or blocked storage; start clean */
    }
  }, [consent, initialHouse]);

  useEffect(() => {
    if (consent !== "accepted") return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
      } catch {
        /* full or unavailable */
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [fields, consent]);

  /* ------------------------------------------------------------- updating */

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => {
      const next = { ...f, [key]: value };
      // Moving check-in past check-out would leave an impossible pair on screen.
      if (key === "checkIn" && next.checkOut && next.checkOut <= String(value)) {
        next.checkOut = "";
      }
      return next;
    });
    setErrors((e) => (e[key as keyof FieldErrors] ? { ...e, [key]: undefined } : e));
    setHandoff(null);
  };

  const focusFirstError = (found: FieldErrors) => {
    const first = FIELD_ORDER.find((key) => found[key]);
    if (!first) return;
    // Focus without the browser's own scrolling, then move the minimum needed.
    // `scroll-margin-top` on #booking-* (globals.css) keeps the result clear of
    // the sticky header, so the field and its message are both visible.
    const node = formRef.current?.querySelector<HTMLElement>(`#booking-${first}`);
    node?.focus({ preventScroll: true });
    node?.scrollIntoView({ block: "nearest", behavior: "auto" });
  };

  /* ----------------------------------------------------------- submitting */

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "checking") return;

    const payload = {
      ...fields,
      guests: Number(fields.guests),
      company:
        (formRef.current?.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "",
    };

    // Client pass: instant feedback, no round trip.
    const local = validateBooking(payload);
    if (!local.ok) {
      setErrors(local.errors);
      focusFirstError(local.errors);
      return;
    }

    setStatus("checking");
    setErrors({});

    // Server pass: the one that decides.
    const result = await submitBooking(payload);
    if (!result.ok) {
      setStatus("idle");
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }

    const data = result.data;
    const chosen = houseBySlug(data.house);
    const pageUrl = window.location.origin + pathname;
    const stayNights = nightsBetween(data.checkIn, data.checkOut);

    if (consent === "accepted") {
      try {
        await bookingStore.save({
          ...data,
          template: template ?? "shared",
          pageUrl,
          nights: stayNights,
        });
      } catch {
        /* storage is best-effort; the hand-off matters more */
      }
    }

    const url = bookingRequestUrl(
      data,
      { template, pageUrl, action: "Send booking request" },
      chosen?.name ?? data.house,
      chosen?.priceFromIDR ?? null,
    );

    setHandoff({ url, nights: stayNights });
    setStatus("ready");

    // Try to open it. Browsers often block a window opened after an await,
    // which is exactly why the panel below carries a real link as well.
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const houseOptions = useMemo(
    () =>
      houses.map((h) => ({
        value: h.slug,
        label: h.name,
        hint: `from ${formatIDR(h.priceFromIDR)}`,
      })),
    [],
  );

  const guestOptions = useMemo(
    () => guestCountOptions.map((n) => ({ value: String(n), label: pluralise(n, "guest", "guests") })),
    [],
  );

  const inputClass =
    "r-sm w-full border bg-surface px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/70 transition-colors";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={clsx("grid gap-5", className)}>
      <p className="sr-only-x">
        Send a booking request. We reply on WhatsApp. No payment is taken here.
      </p>

      {/* Honeypot. Clipped, never offset to a negative absolute position — that
          trick escapes the layout and creates a horizontal scrollbar. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="booking-company">Company</label>
        <input id="booking-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="booking-name" label="Your name" error={errors.name}>
          <input
            id="booking-name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "booking-name-error" : undefined}
            className={clsx(inputClass, errors.name ? "border-accent" : "border-field")}
            placeholder="First and last name"
          />
        </Field>

        <Field id="booking-email" label="Email" error={errors.email}>
          <input
            id="booking-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "booking-email-error" : undefined}
            className={clsx(inputClass, errors.email ? "border-accent" : "border-field")}
            placeholder="you@example.com"
          />
        </Field>

        <Field id="booking-phone" label="WhatsApp number" error={errors.phone}>
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "booking-phone-error" : undefined}
            className={clsx(inputClass, errors.phone ? "border-accent" : "border-field")}
            placeholder="+62 ..."
          />
        </Field>

        <Field id="booking-house" label="Which house" error={errors.house}>
          <Listbox
            id="booking-house"
            label="Which house"
            value={fields.house}
            options={houseOptions}
            onChange={(v) => set("house", v)}
            placeholder="Choose one of the three"
            invalid={Boolean(errors.house)}
            describedBy={errors.house ? "booking-house-error" : undefined}
          />
        </Field>

        <Field id="booking-checkIn" label="Check-in" error={errors.checkIn}>
          <DateField
            id="booking-checkIn"
            label="Check-in date"
            value={fields.checkIn}
            onChange={(v) => set("checkIn", v)}
            invalid={Boolean(errors.checkIn)}
            describedBy={errors.checkIn ? "booking-checkIn-error" : undefined}
          />
        </Field>

        <Field id="booking-checkOut" label="Check-out" error={errors.checkOut}>
          <DateField
            id="booking-checkOut"
            label="Check-out date"
            value={fields.checkOut}
            onChange={(v) => set("checkOut", v)}
            min={fields.checkIn ? addDays(fields.checkIn, 1) : undefined}
            invalid={Boolean(errors.checkOut)}
            describedBy={errors.checkOut ? "booking-checkOut-error" : undefined}
          />
        </Field>

        <Field id="booking-guests" label="Guests" error={errors.guests}>
          <Listbox
            id="booking-guests"
            label="Number of guests"
            value={fields.guests}
            options={guestOptions}
            onChange={(v) => set("guests", v)}
            invalid={Boolean(errors.guests)}
            describedBy={errors.guests ? "booking-guests-error" : undefined}
          />
        </Field>

        <div className="flex items-end">
          <p
            aria-live="polite"
            className="r-sm w-full border-l-2 border-gold bg-raised px-4 py-3.5 text-sm text-ink"
          >
            {nights > 0 ? (
              <>
                <span className="font-medium">{pluralise(nights, "night", "nights")}</span>
                {house && (
                  <span className="text-muted">
                    {" "}
                    — from {formatIDR(house.priceFromIDR)} per night
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted">Pick both dates and the night count appears here.</span>
            )}
          </p>
        </div>
      </div>

      <Field id="booking-notes" label="Anything we should know" error={errors.notes} optional>
        <textarea
          id="booking-notes"
          name="notes"
          rows={4}
          value={fields.notes}
          onChange={(e) => set("notes", e.target.value)}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={errors.notes ? "booking-notes-error" : undefined}
          className={clsx(inputClass, "resize-y", errors.notes ? "border-accent" : "border-field")}
          placeholder="Arrival time, airport transfer, a package you are interested in."
        />
      </Field>

      {errors.form && (
        <p role="alert" className="r-sm border border-accent px-4 py-3 text-sm text-ink">
          {errors.form}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "checking"}
          className="r-pill bg-gold px-7 py-3.5 text-[15px] font-medium text-ongold transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "checking" ? "Checking…" : "Send booking request"}
        </button>
        <p className="text-sm text-muted">
          Opens WhatsApp with your details filled in. No payment is taken here.
        </p>
      </div>

      {handoff && (
        <div role="status" className="r-sm border border-gold bg-raised p-4 text-sm text-ink">
          <p className="font-medium">
            Your request is ready — {pluralise(handoff.nights, "night", "nights")}.
          </p>
          <p className="mt-1.5 text-muted">
            WhatsApp should have opened in a new tab with everything filled in. If
            your browser blocked it, use the link below. Nothing is booked until we
            reply and confirm.
          </p>
          <a
            href={handoff.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-medium underline underline-offset-4"
          >
            Open the message in WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ field */

function Field({
  id,
  label,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium tracking-wide text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[13px] text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

/** Accept a `YYYY-MM-DD` that is a real date and not in the past. */
function safeDate(value: string | null): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  if (!parseISODate(value)) return "";
  return value >= todayISO() ? value : "";
}
