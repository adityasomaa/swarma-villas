import { business } from "@/content/site";
import { TEMPLATES, type TemplateId } from "@/lib/templates";
import { formatDateLong, formatIDR, nightsBetween, pluralise } from "@/lib/format";

/* =============================================================================
   WHATSAPP — every message the site can send.
   -----------------------------------------------------------------------------
   The villa lists TWO numbers: a reservations phone line and a separate
   WhatsApp number. Messages go to the WhatsApp one; the phone number is only
   ever used for tel: links. Getting these the wrong way round would send every
   enquiry into a phone that has no WhatsApp on it.

   Three things are attached to every message automatically:
     - the page the guest was on,
     - which of the three previews they were looking at,
     - the label of the button they pressed.

   The preview name is the point: once the client is clicking through all three,
   the villa's WhatsApp inbox becomes the measurement of which one people use.
   ========================================================================== */

export type Provenance = {
  template: TemplateId | null;
  pageUrl: string;
  action: string;
};

function footer(p: Provenance): string {
  const lines = ["", "---"];
  if (p.pageUrl) lines.push(`Sent from: ${p.pageUrl}`);
  if (p.template) {
    const t = TEMPLATES[p.template];
    lines.push(`Design preview: Template ${t.index} - ${t.name}`);
  }
  if (p.action) lines.push(`Button: ${p.action}`);
  return lines.join("\n");
}

function link(text: string): string {
  return `https://wa.me/${business.whatsappE164}?text=${encodeURIComponent(text)}`;
}

/** A general enquiry, optionally about one specific thing. */
export function generalEnquiryUrl(p: Provenance, subject?: string): string {
  const opening = subject
    ? `Hello Swarma Villas, I have a question about ${subject}.`
    : "Hello Swarma Villas, I have a question about staying with you.";
  return link(`${opening}${footer(p)}`);
}

export type BookingMessage = {
  name: string;
  email: string;
  phone: string;
  house: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes?: string;
};

/** The booking request itself, one field per line so it is readable on a phone. */
export function bookingRequestUrl(
  data: BookingMessage,
  p: Provenance,
  houseName: string,
  rateIDR: number | null,
): string {
  const nights = nightsBetween(data.checkIn, data.checkOut);
  const lines = [
    "Hello Swarma Villas, I would like to request a booking.",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `WhatsApp: ${data.phone}`,
    `House: ${houseName}${rateIDR ? ` (from ${formatIDR(rateIDR)} per night)` : ""}`,
    `Check-in: ${formatDateLong(data.checkIn)}`,
    `Check-out: ${formatDateLong(data.checkOut)}`,
    `Nights: ${pluralise(nights, "night", "nights")}`,
    `Guests: ${pluralise(data.guests, "guest", "guests")}`,
  ];
  if (data.notes?.trim()) {
    lines.push("", "Notes:", data.notes.trim());
  }
  return link(lines.join("\n") + footer(p));
}
