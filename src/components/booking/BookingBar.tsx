"use client";

import { useEffect, useRef, useState } from "react";

import { DateField } from "@/components/form/DateField";
import { Listbox } from "@/components/form/Listbox";
import { Button } from "@/components/ui";
import { guestCountOptions, type House } from "@/content/site";
import {
  engineUrl,
  fetchEngineRooms,
  pickRoom,
  type EngineRoom,
} from "@/lib/booking/engine";
import { clsx } from "@/lib/clsx";
import { addDays, nightsBetween, todayISO } from "@/lib/format";

/* =============================================================================
   THE BOOKING BAR
   -----------------------------------------------------------------------------
   Dates and guests on the page, then straight into the villa's booking engine
   with both already applied — rather than a bare link that drops a guest on a
   landing page and asks them to start again.

   With a `house`, it also asks the engine whether that house is free for the
   chosen dates and says so.

   IT DOES NOT SHOW THE ENGINE'S PRICE, on purpose. The engine is currently
   quoting more than this site publishes because the villa has not set their
   discounts up in it yet, and they have asked for the published rates to
   stand. Printing the undiscounted figure here would contradict the rate card
   directly above it. When the discounts are in and the two agree, the price is
   already in `match.fromIDR` and can go back on one line.

   THE LIVE LINE IS OPTIONAL BY DESIGN. Every failure path — a refused request,
   a changed field, a renamed room — ends with the line simply not being shown.
   The dates, the guests and the button never depend on it.
   ========================================================================== */

type State = "idle" | "loading" | "done";

export function BookingBar({
  house,
  className,
}: {
  /** Omit on a page that is not about one house. */
  house?: House;
  className?: string;
}) {
  const today = todayISO();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const [rooms, setRooms] = useState<EngineRoom[] | null>(null);
  const [state, setState] = useState<State>("idle");
  const abort = useRef<AbortController | null>(null);

  const nights = nightsBetween(checkIn, checkOut);
  const complete = Boolean(checkIn && checkOut && nights > 0);

  // Check-out can never be on or before check-in, so moving check-in past it
  // clears it rather than leaving an impossible pair on screen.
  function onCheckIn(iso: string) {
    setCheckIn(iso);
    if (checkOut && checkOut <= iso) setCheckOut("");
  }

  useEffect(() => {
    if (!complete) {
      setRooms(null);
      setState("idle");
      return;
    }
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setState("loading");

    // A small delay, so dragging across a calendar does not fire a request per day.
    const timer = setTimeout(async () => {
      const result = await fetchEngineRooms(
        { checkIn, checkOut, guests: Number(guests) },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setRooms(result);
      setState("done");
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [checkIn, checkOut, guests, complete]);

  const match = house && rooms ? pickRoom(rooms, house.engineRooms) : null;
  const href = engineUrl({ checkIn, checkOut, guests: Number(guests) });

  return (
    <div className={clsx("border border-line bg-canvas p-6 md:p-7", className)}>
      <h3 className="kicker text-accent">Check availability</h3>

      {/* One column, not two. The bar lives in a narrow aside, and a viewport
          breakpoint knows nothing about that: at sm: the two fields would sit
          side by side in 150px each and truncate the dates they are showing. */}
      <div className="mt-5 grid gap-4">
        <DateField
          id="bar-checkIn"
          label="Check in"
          value={checkIn}
          onChange={onCheckIn}
          min={today}
        />
        <DateField
          id="bar-checkOut"
          label="Check out"
          value={checkOut}
          onChange={setCheckOut}
          min={checkIn ? addDays(checkIn, 1) : addDays(today, 1)}
        />
      </div>

      <div className="mt-4">
        <Listbox
          id="bar-guests"
          label="Guests"
          value={guests}
          onChange={setGuests}
          options={guestCountOptions.map((n) => ({
            value: String(n),
            label: n === 1 ? "1 guest" : `${n} guests`,
          }))}
        />
      </div>

      {/* aria-live, because this answer arrives after the dates were chosen. */}
      <p className="mt-5 min-h-[1.5rem] text-[0.9375rem] leading-[1.6]" aria-live="polite">
        {!complete && <span className="text-subtle">Pick both dates to see what is free.</span>}
        {complete && state === "loading" && <span className="text-subtle">Checking…</span>}
        {complete && state === "done" && house && match && (
          <span className="text-ink">
            {house.name} is free for {nights} {nights === 1 ? "night" : "nights"}.{" "}
            <span className="text-subtle">Rates are shown in the next step.</span>
          </span>
        )}
        {complete && state === "done" && house && rooms && !match && (
          <span className="text-muted">
            {house.name} is taken for these dates. The engine will show what else is free.
          </span>
        )}
        {complete && state === "done" && (!rooms || !house) && (
          <span className="text-subtle">
            {nights} {nights === 1 ? "night" : "nights"}. Rates and availability are shown in the
            next step.
          </span>
        )}
      </p>

      <Button href={href} external className="mt-2 w-full">
        {complete ? "Continue to booking" : "Open the booking engine"}
      </Button>

      <p className="mt-4 text-[0.75rem] leading-relaxed text-subtle">
        Booking is handled by Swarma&rsquo;s own booking engine, which opens in a new tab.
      </p>
    </div>
  );
}
