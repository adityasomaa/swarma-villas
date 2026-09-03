import { z } from "zod";
import { houses } from "@/content/site";
import { nightsBetween, parseISODate, todayISO } from "@/lib/format";

/**
 * ONE schema, used in two places:
 *   - the browser, for instant field-level feedback, and
 *   - the server action in src/app/actions/booking.ts, which re-validates
 *     everything before a request is accepted.
 *
 * Client-side validation is a convenience. The server copy is the real one: a
 * request that skips the form entirely still has to satisfy this.
 */

const HOUSE_SLUGS = houses.map((h) => h.slug) as [string, ...string[]];

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the calendar to pick a date.")
  .refine((v) => parseISODate(v) !== null, "That is not a real date.");

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Please tell us your name.").max(80, "That name is too long."),
    email: z
      .string()
      .trim()
      .min(1, "Please add an email address.")
      .email("That email address does not look right."),
    phone: z
      .string()
      .trim()
      .min(6, "Please add a WhatsApp number we can reply to.")
      .max(24, "That number is too long.")
      .regex(/^[+0-9()\-.\s]+$/, "Use digits, spaces, + ( ) - only."),
    house: z.enum(HOUSE_SLUGS, { message: "Choose one of the three houses." }),
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.coerce
      .number()
      .int()
      .min(1, "At least one guest.")
      .max(4, "Each house sleeps two. For a larger party, message us on WhatsApp."),
    notes: z.string().trim().max(1000, "Please keep notes under 1000 characters.").optional(),
    /**
     * Honeypot. Real people never see this field, so anything in it is a bot.
     * Hidden with clip-path, not a negative absolute offset, so it cannot
     * create a horizontal scrollbar.
     */
    company: z.string().max(0, "Rejected.").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.checkIn < todayISO()) {
      ctx.addIssue({ code: "custom", path: ["checkIn"], message: "Check-in cannot be in the past." });
    }
    if (data.checkOut <= data.checkIn) {
      ctx.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
    if (nightsBetween(data.checkIn, data.checkOut) > 60) {
      ctx.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "For stays longer than 60 nights, message us on WhatsApp.",
      });
    }
  });

export type BookingRequest = z.infer<typeof bookingSchema>;

/** Field order, used to focus the first invalid field rather than the page top. */
export const FIELD_ORDER = [
  "name",
  "email",
  "phone",
  "house",
  "checkIn",
  "checkOut",
  "guests",
  "notes",
] as const;

export type BookingField = (typeof FIELD_ORDER)[number];
export type FieldErrors = Partial<Record<BookingField | "form", string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form") as BookingField | "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function validateBooking(
  input: unknown,
): { ok: true; data: BookingRequest } | { ok: false; errors: FieldErrors } {
  const parsed = bookingSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: toFieldErrors(parsed.error) };
}
