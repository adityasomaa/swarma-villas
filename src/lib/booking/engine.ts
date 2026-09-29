/* =============================================================================
   THE BOOKING ENGINE
   -----------------------------------------------------------------------------
   Guestaps / MarketConnect, the villa's own provider. Two things live here: the
   address a guest is sent to, and the read-only lookup that tells a house page
   what the engine is actually charging for a set of dates.

   WHY NOT THE VENDOR'S WIDGET. They supplied a drop-in HTML page, but it is
   built on Bootstrap 5 and flatpickr and pulls both, a flatpickr plugin and a
   Google font from four CDNs. Bootstrap's reset would land on top of this
   site's own styles. All the widget ultimately does is build the URL below.

   TWO ENDPOINTS, DIFFERENT STANDING:
     - search-availability is the one the vendor's own widget calls.
     - search-room is the one their booking page calls. It is not documented to
       us, and two of their other endpoints sit behind Cloudflare and refuse a
       plain request. So every call here is treated as optional: if it fails,
       or changes shape, or starts refusing us, the page shows the button and
       nothing else. Nothing on the page may depend on it.
   ========================================================================== */

const BASE = "https://secure.guestaps.com";
const SLUG = "swarma-villas-ubud";
const MERCHANT = "88b92680-6b1c-4e52-a22b-d6ed6f0d5692";
const API = "https://api.marketconnect.id/guestapp-hotel/api";

export type Stay = {
  checkIn: string;
  checkOut: string;
  /** Adults. The engine takes children and infants too; the site asks for neither. */
  guests: number;
};

/**
 * Where "Book Direct" and "Check availability" go.
 *
 * With both dates it opens the engine on its booking step with them applied;
 * without, it opens the property's landing page and asks for them there.
 */
export function engineUrl(stay?: Partial<Stay>, promoCode?: string): string {
  if (!stay?.checkIn || !stay?.checkOut) return `${BASE}/${SLUG}`;
  const promo = promoCode?.trim() || "promo_code_empty";
  const guests = `${stay.guests ?? 2}-0-0`;
  return (
    `${BASE}/${SLUG}/hotel-filter-redirect/` +
    `${stay.checkIn}/${stay.checkOut}/${encodeURIComponent(promo)}?guest=${guests}`
  );
}

/* -------------------------------------------------------------------------- */

export type EngineRoom = {
  name: string;
  /** Rooms of this type left for the dates asked about. */
  availability: number;
  bookable: boolean;
  /** Cheapest rate for the dates, per night, in IDR. */
  fromIDR: number | null;
};

type RawRate = { price?: string | number; availability?: number; bookable?: boolean };
type RawRoom = {
  name?: string;
  availability?: number;
  bookable?: boolean;
  room_rate?: RawRate[];
};

/**
 * What the engine is charging and holding for these dates, per room.
 *
 * Returns null rather than throwing on any failure — a booking bar that breaks
 * because a third party changed a field name is worse than one that quietly
 * stops showing a price.
 */
export async function fetchEngineRooms(
  stay: Stay,
  signal?: AbortSignal,
): Promise<EngineRoom[] | null> {
  const params = new URLSearchParams({
    use_promotion_combine: "true",
    check_in_date: stay.checkIn,
    check_out_date: stay.checkOut,
    adult: String(stay.guests),
    child: "0",
    infant: "0",
    price_min: "",
    price_max: "",
    sort_by: "room_type",
    merchant_id: MERCHANT,
  });

  try {
    const res = await fetch(`${API}/search-room?${params}`, { signal });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const rooms = (json as { success?: boolean; data?: RawRoom[] })?.data;
    if (!Array.isArray(rooms)) return null;

    return rooms.flatMap((room) => {
      if (typeof room?.name !== "string") return [];
      const prices = (room.room_rate ?? [])
        .map((rate) => Number(rate?.price))
        .filter((n) => Number.isFinite(n) && n > 0);
      return [
        {
          name: room.name,
          availability: Number(room.availability) || 0,
          bookable: room.bookable !== false,
          fromIDR: prices.length ? Math.min(...prices) : null,
        },
      ];
    });
  } catch {
    return null;
  }
}

/**
 * The cheapest bookable room among a house's rooms, or null if none is free.
 *
 * A room without a published price still counts as free — the caller wants to
 * know whether the house can be had, and the price is a separate question.
 */
export function pickRoom(rooms: EngineRoom[], names: readonly string[]): EngineRoom | null {
  const free = rooms.filter((r) => names.includes(r.name) && r.bookable && r.availability > 0);
  if (free.length === 0) return null;
  return free.reduce((best, r) =>
    r.fromIDR !== null && (best.fromIDR === null || r.fromIDR < best.fromIDR) ? r : best,
  );
}
