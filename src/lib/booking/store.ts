import type { BookingRequest } from "@/lib/booking/schema";

/**
 * BOOKING STORAGE ADAPTER
 * -----------------------
 * There is no backend yet and this file is deliberately honest about that.
 *
 * Every read and write goes through the `BookingStore` interface. Today the
 * only working implementation writes to the visitor's own browser, which is
 * enough to demonstrate the flow end to end but is NOT a record: it lives on
 * one device, in one browser, and disappears when site data is cleared. The
 * actual booking is the WhatsApp message the guest sends.
 *
 * `createDatabaseStore` is the empty seam. Fill in the four methods against
 * whatever you choose, then flip `bookingStore` at the bottom. Nothing else in
 * the codebase touches storage directly, so nothing else has to change.
 */

export type StoredBooking = BookingRequest & {
  id: string;
  createdAt: string;
  pageUrl: string;
  nights: number;
  origin: "local" | "database";
};

export interface BookingStore {
  readonly kind: "local" | "database";
  save(input: Omit<StoredBooking, "id" | "createdAt" | "origin">): Promise<StoredBooking>;
  list(): Promise<StoredBooking[]>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

const KEY = "swarma.booking-requests.v1";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readAll(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredBooking[]) : [];
  } catch {
    // Private mode, blocked site data, or corrupted JSON. Behave as if empty.
    return [];
  }
}

function writeAll(rows: StoredBooking[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    // Storage unavailable or full. The WhatsApp hand-off is the part that
    // actually reaches the villa, so this is not fatal.
  }
}

export function createLocalStore(): BookingStore {
  return {
    kind: "local",
    async save(input) {
      const record: StoredBooking = {
        ...input,
        id: makeId(),
        createdAt: new Date().toISOString(),
        origin: "local",
      };
      writeAll([record, ...readAll()].slice(0, 50));
      return record;
    },
    async list() {
      return readAll();
    },
    async remove(id) {
      writeAll(readAll().filter((r) => r.id !== id));
    },
    async clear() {
      writeAll([]);
    },
  };
}

/**
 * EMPTY SEAM — the real backend.
 *
 * Suggested table: id (uuid, pk), created_at (timestamptz), name, email, phone,
 * house (text), check_in (date), check_out (date), nights (int), guests (int),
 * notes (text), page_url (text).
 */
export function createDatabaseStore(): BookingStore {
  const notImplemented = (method: string): never => {
    throw new Error(
      `BookingStore.${method} is not implemented. Wire this adapter to your ` +
        "database, then set bookingStore to createDatabaseStore().",
    );
  };
  return {
    kind: "database",
    async save() {
      return notImplemented("save");
    },
    async list() {
      return notImplemented("list");
    },
    async remove() {
      return notImplemented("remove");
    },
    async clear() {
      return notImplemented("clear");
    },
  };
}

/** Swap this line — and only this line — when the database is ready. */
export const bookingStore: BookingStore = createLocalStore();
