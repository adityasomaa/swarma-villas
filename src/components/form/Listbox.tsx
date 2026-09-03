"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   LISTBOX — a real one, never a styled <select>.
   -----------------------------------------------------------------------------
   Native selects cannot be styled consistently across platforms, which is why
   they are replaced here. Replacing one means reimplementing everything the
   native control gave away for free, so all of it is here:

     ArrowDown / ArrowUp   move the active option, opening the list if closed
     Home / End            first and last option
     Enter / Space         commit the active option
     Escape                close without changing anything, focus back on trigger
     Tab                   close and move on, keeping the current value
     type-ahead            typing "ba" jumps to "Bamboo Dome"; the buffer clears
                           after 600ms, the same as the platform control
     click outside         closes

   Focus returns to the trigger on every close path. That is the detail most
   custom selects miss, and the one that traps keyboard users.
   ========================================================================== */

export type Option<T extends string> = {
  value: T;
  label: string;
  /** A second line on the right, e.g. a nightly rate. */
  hint?: string;
};

type Props<T extends string> = {
  id?: string;
  label: string;
  value: T | "";
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

const TYPEAHEAD_RESET_MS = 600;

export function Listbox<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select…",
  invalid = false,
  describedBy,
  className,
}: Props<T>) {
  const autoId = useId();
  const triggerId = id ?? `lb-${autoId}`;
  const listId = `${triggerId}-list`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typeahead = useRef({ buffer: "", timer: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const openList = useCallback(() => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) return;
      onChange(option.value);
      close();
    },
    [options, onChange, close],
  );

  // Keep the active option in view inside the list, not by scrolling the page.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const runTypeahead = useCallback(
    (key: string) => {
      const state = typeahead.current;
      window.clearTimeout(state.timer);
      const repeated = state.buffer.length > 0;
      state.buffer += key.toLowerCase();
      state.timer = window.setTimeout(() => {
        state.buffer = "";
      }, TYPEAHEAD_RESET_MS);

      const start = open ? active : Math.max(selectedIndex, 0);
      const n = options.length;
      for (let step = 0; step < n; step++) {
        const i = (start + (repeated ? 0 : 1) + step) % n;
        const candidate = options[i];
        if (candidate && candidate.label.toLowerCase().startsWith(state.buffer)) {
          if (open) setActive(i);
          else onChange(candidate.value);
          return;
        }
      }
    },
    [open, active, selectedIndex, options, onChange],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(last, i + 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        if (!open) return;
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        if (!open) return;
        event.preventDefault();
        setActive(last);
        return;
      case "Enter":
        event.preventDefault();
        if (open) commit(active);
        else openList();
        return;
      case " ":
      case "Spacebar":
        // Space opens or commits only; feeding it to type-ahead would make any
        // value containing a space unreachable.
        event.preventDefault();
        if (open) commit(active);
        else openList();
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        close();
        return;
      case "Tab":
        if (open) setOpen(false);
        return;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  };

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onKeyDown={onKeyDown}
        onClick={() => (open ? close(false) : openList())}
        className={clsx(
          "r-sm flex w-full items-center justify-between gap-3 border bg-surface px-4 py-3.5 text-left text-[15px] text-ink transition-colors",
          invalid ? "border-accent" : "border-field hover:border-ink/50",
        )}
      >
        <span className={clsx("min-w-0 truncate", !selected && "text-muted")}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={clsx("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")}
        >
          <path
            d="M3 6l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          className="r-sm z-overlay absolute left-0 right-0 top-[calc(100%+4px)] max-h-64 overflow-y-auto border border-field bg-surface py-1 shadow-[0_14px_40px_rgba(0,0,0,0.18)]"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              data-index={index}
              aria-selected={option.value === value}
              onPointerEnter={() => setActive(index)}
              onClick={() => commit(index)}
              className={clsx(
                "cursor-pointer px-4 py-2.5 text-[15px] text-ink",
                index === active && "bg-raised",
              )}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate">{option.label}</span>
                {option.hint && <span className="shrink-0 text-xs text-muted">{option.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
