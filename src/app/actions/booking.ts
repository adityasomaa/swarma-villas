"use server";

import { validateBooking, type BookingRequest, type FieldErrors } from "@/lib/booking/schema";

/* =============================================================================
   BOOKING — SERVER VALIDATION
   -----------------------------------------------------------------------------
   The browser validates as you type, because waiting for a round trip to be
   told your email is missing is miserable. That check is a convenience: it can
   be skipped, disabled, or bypassed by posting straight at this action.

   So the same schema runs again here, and this is the copy that decides. A
   request that fails here does not proceed, whatever the client believed.

   What this action does NOT do: it does not send anything, and it does not
   claim a room. There is no availability system behind this site. It validates,
   and hands a clean object back so the browser can build the WhatsApp message.
   ========================================================================== */

export type BookingResult =
  | { ok: true; data: BookingRequest }
  | { ok: false; errors: FieldErrors };

export async function submitBooking(raw: unknown): Promise<BookingResult> {
  const result = validateBooking(raw);
  if (!result.ok) return { ok: false, errors: result.errors };
  return { ok: true, data: result.data };
}
