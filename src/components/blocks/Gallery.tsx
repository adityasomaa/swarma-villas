"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Photo, photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { useUI } from "@/components/shared/UIProvider";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   PHOTOGRAPH GRID, WITH A LIGHTBOX
   -----------------------------------------------------------------------------
   Used by the house pages, the experience pages and /gallery.

   The lightbox is a modal, so it takes on every obligation a modal has:

     - `openOverlay()` tells the UI provider a surface is up, which stops Lenis.
       Without that the page scrolls behind the photograph you are looking at.
     - Arrow keys move through the set, Escape closes it, and focus returns to
       the thumbnail that opened it.
     - Focus is trapped inside the dialog while it is open.
     - It renders through a portal into <body>, because the grids it opens from
       sit inside `overflow: hidden` sections that would otherwise clip it.

   Each thumbnail is a <button>, not a div with an onClick, so it is reachable
   by keyboard and announced as something you can activate.
   ========================================================================== */

export function Gallery({
  slugs,
  columns = 3,
}: {
  slugs: string[];
  columns?: 2 | 3 | 4;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    const returnTo = openIndex;
    setOpenIndex(null);
    // Focus goes back to the thumbnail, not to the top of the document.
    if (returnTo !== null) {
      requestAnimationFrame(() => triggers.current[returnTo]?.focus());
    }
  }, [openIndex]);

  return (
    <>
      <ul
        className={clsx(
          // A hairline grid: the gap is the line colour showing through.
          "grid gap-px bg-line",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-2 md:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-4",
        )}
      >
        {slugs.map((slug, i) => {
          const record = photo(slug);
          return (
            <li key={slug} className="bg-canvas">
              <Reveal delay={(i % columns) * 60}>
                <button
                  ref={(node) => {
                    triggers.current[i] = node;
                  }}
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group block w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Photo
                    slug={slug}
                    ratio={1}
                    sizes={`(min-width: 768px) ${Math.round(100 / columns)}vw, 50vw`}
                    imgClassName="transition-transform duration-[900ms] ease-out-quint group-hover:scale-[1.05]"
                    alt=""
                  />
                  <span className="sr-only">
                    {record?.caption ?? "Open this photograph"} — open larger
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {openIndex !== null && (
        <Lightbox
          slugs={slugs}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={close}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Lightbox({
  slugs,
  index,
  onIndex,
  onClose,
}: {
  slugs: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { openOverlay, closeOverlay } = useUI();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Tell the rest of the UI that a surface is up: Lenis stops, and the page
  // behind stops scrolling.
  useEffect(() => {
    openOverlay();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      closeOverlay();
      document.body.style.overflow = previous;
    };
  }, [openOverlay, closeOverlay]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndex((index + 1) % slugs.length);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndex((index - 1 + slugs.length) % slugs.length);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, slugs.length, onIndex, onClose]);

  if (!mounted) return null;

  const slug = slugs[index];
  if (!slug) return null;
  const record = photo(slug);

  return createPortal(
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${slugs.length}`}
      className="z-overlay fixed inset-0 flex flex-col bg-[rgba(12,11,8,0.94)] p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 pb-3 text-white/70">
        <p className="text-[0.8125rem] tabular-nums">
          {index + 1} / {slugs.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center text-[1.75rem] leading-none text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd403]"
        >
          <span className="sr-only">Close</span>
          <span aria-hidden>&times;</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-2 sm:gap-4">
        <NavButton
          label="Previous photograph"
          arrow="&#8592;"
          onClick={() => onIndex((index - 1 + slugs.length) % slugs.length)}
        />

        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <img
            src={`/img/${record?.sizes[record.sizes.length - 1]?.file ?? ""}`}
            alt={record?.caption ?? ""}
            className="max-h-full w-auto max-w-full object-contain"
          />
          {record?.caption && (
            <figcaption className="mt-4 max-w-2xl text-center text-[0.875rem] text-white/70">
              {record.caption}
            </figcaption>
          )}
        </figure>

        <NavButton
          label="Next photograph"
          arrow="&#8594;"
          onClick={() => onIndex((index + 1) % slugs.length)}
        />
      </div>
    </div>,
    document.body,
  );
}

function NavButton({
  label,
  arrow,
  onClick,
}: {
  label: string;
  arrow: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd403]"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden dangerouslySetInnerHTML={{ __html: arrow }} />
    </button>
  );
}
