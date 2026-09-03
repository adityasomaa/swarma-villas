"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useUI } from "@/components/shared/UIProvider";
import { clsx } from "@/lib/clsx";
import { addDays, formatDateLong, parseISODate, toISODate, todayISO } from "@/lib/format";

/* =============================================================================
   DATE FIELD + CALENDAR
   -----------------------------------------------------------------------------
   THE WHOLE FIELD IS THE TRIGGER. This was asked for explicitly and it is the
   right behaviour anyway: the control is a single <button> spanning the label
   area, the value and the icon, so a click or a tap anywhere on it opens the
   calendar. There is no separate icon hit-area to find.

   The panel is rendered through a PORTAL into <body>. Rendered in place it
   would inherit every `overflow: hidden` between it and the root — a card, a
   section, a two-column grid — and get sliced off at the container edge. A
   portal has no ancestors to be clipped by, so it is positioned in fixed
   coordinates from the trigger's rect and repositioned on scroll and resize.

   It does NOT display availability. This site does not know which nights are
   free and will not pretend to. Past dates are blocked because that is
   arithmetic, not availability; everything else is selectable, and the panel
   says plainly that availability is confirmed by message.
   ========================================================================== */

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable date, inclusive. Defaults to today. */
  min?: string;
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
};

/** Monday-first weekday index. */
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function DateField({
  id,
  label,
  value,
  onChange,
  min,
  invalid = false,
  describedBy,
  placeholder = "Select a date",
}: Props) {
  const { openOverlay, closeOverlay } = useUI();
  const panelId = `${id}-calendar`;
  const noteId = useId();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const floor = min ?? todayISO();
  const [cursor, setCursor] = useState<string>(() => value || floor);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (value) setCursor(value);
    else if (cursor < floor) setCursor(floor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, floor]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Suspend smooth scrolling while the panel is up, and release it on unmount
  // even if the component disappears mid-open.
  useEffect(() => {
    if (!open) return;
    openOverlay();
    return () => closeOverlay();
  }, [open, openOverlay, closeOverlay]);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const panelW = Math.min(330, window.innerWidth - 16);
    const panelH = panelRef.current?.offsetHeight ?? 372;

    const below = rect.bottom + 8;
    const fitsBelow = below + panelH <= window.innerHeight - 8;
    const top = fitsBelow ? below : Math.max(8, rect.top - panelH - 8);
    const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - panelW - 8));

    setPos({ top, left, width: panelW });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const handler = () => place();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // Move focus into the grid so arrow keys work as soon as it opens.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-day-focus="true"]')?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const cursorDate = parseISODate(cursor) ?? new Date();
  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth();

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const lead = mondayIndex(first);
    const count = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= count; d++) cells.push(toISODate(new Date(year, month, d)));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const moveCursor = (deltaDays: number) => {
    const next = addDays(cursor, deltaDays);
    setCursor(next < floor ? floor : next);
  };

  const shiftMonth = (delta: number) => {
    const d = parseISODate(cursor) ?? new Date();
    const target = new Date(d.getFullYear(), d.getMonth() + delta, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    const day = Math.min(d.getDate(), lastDay);
    const next = toISODate(new Date(target.getFullYear(), target.getMonth(), day));
    setCursor(next < floor ? floor : next);
  };

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft": event.preventDefault(); moveCursor(-1); return;
      case "ArrowRight": event.preventDefault(); moveCursor(1); return;
      case "ArrowUp": event.preventDefault(); moveCursor(-7); return;
      case "ArrowDown": event.preventDefault(); moveCursor(7); return;
      case "Home": {
        event.preventDefault();
        const d = parseISODate(cursor)!;
        setCursor(toISODate(new Date(d.getFullYear(), d.getMonth(), 1)));
        return;
      }
      case "End": {
        event.preventDefault();
        const d = parseISODate(cursor)!;
        setCursor(toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 0)));
        return;
      }
      case "PageUp": event.preventDefault(); shiftMonth(-1); return;
      case "PageDown": event.preventDefault(); shiftMonth(1); return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (cursor >= floor) {
          onChange(cursor);
          close();
        }
        return;
      case "Escape":
        event.preventDefault();
        close();
        return;
    }
  };

  const panel =
    open && mounted && pos
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-label={`${label} — choose a date`}
            className="r-sm z-overlay fixed border border-field bg-surface p-3 text-ink shadow-[0_20px_56px_rgba(0,0,0,0.26)]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="r-sm p-2 text-muted transition-colors hover:bg-raised hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p aria-live="polite" className="text-sm font-medium">
                {MONTHS[month]} {year}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="r-sm p-2 text-muted transition-colors hover:bg-raised hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div role="grid" aria-label={`${MONTHS[month]} ${year}`} onKeyDown={onGridKeyDown} className="mt-2">
              <div role="row" className="grid grid-cols-7">
                {WEEKDAYS.map((w) => (
                  <span
                    key={w}
                    role="columnheader"
                    aria-label={w}
                    className="py-1 text-center text-[11px] uppercase tracking-wider text-muted"
                  >
                    {w}
                  </span>
                ))}
              </div>

              {Array.from({ length: days.length / 7 }, (_, row) => (
                <div role="row" key={row} className="grid grid-cols-7">
                  {days.slice(row * 7, row * 7 + 7).map((iso, col) => {
                    if (!iso) return <span role="gridcell" key={`e${col}`} className="aspect-square" />;
                    const disabled = iso < floor;
                    const isSelected = iso === value;
                    const isCursor = iso === cursor;
                    return (
                      <button
                        role="gridcell"
                        type="button"
                        key={iso}
                        data-day-focus={isCursor ? "true" : undefined}
                        tabIndex={isCursor ? 0 : -1}
                        disabled={disabled}
                        aria-selected={isSelected}
                        aria-label={formatDateLong(iso)}
                        onClick={() => {
                          onChange(iso);
                          close();
                        }}
                        onFocus={() => setCursor(iso)}
                        className={clsx(
                          "r-sm aspect-square text-sm transition-colors",
                          disabled && "cursor-not-allowed text-muted/40 line-through",
                          !disabled && !isSelected && "text-ink hover:bg-raised",
                          isSelected && "bg-gold font-medium text-ongold",
                        )}
                      >
                        {Number(iso.slice(8, 10))}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <p className="mt-3 border-t border-line pt-2.5 text-[11px] leading-relaxed text-muted">
              This calendar picks dates only. It does not show which nights are
              free — we confirm availability with you on WhatsApp.
            </p>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, noteId].filter(Boolean).join(" ") || undefined}
        onClick={() => (open ? close(false) : setOpen(true))}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={clsx(
          "r-sm flex w-full items-center justify-between gap-3 border bg-surface px-4 py-3.5 text-left text-[15px] transition-colors",
          invalid ? "border-accent" : "border-field hover:border-ink/50",
          value ? "text-ink" : "text-muted",
        )}
      >
        <span className="min-w-0 truncate">{value ? formatDateLong(value) : placeholder}</span>
        <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-muted" aria-hidden="true">
          <rect x="2" y="3.5" width="12" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 6.5h12M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <span id={noteId} className="sr-only-x">
        Opens a calendar. Past dates cannot be selected.
      </span>
      {panel}
    </>
  );
}
