"use client";

import { TLink } from "@/components/shared/Transition";
import { TEMPLATE_LIST } from "@/lib/templates";

/**
 * The three doors out of the 404. A client component so the links go through
 * the curtain like every other link on the site — arriving at a template home
 * plays the arrival loader, which is the right first impression.
 */
export function NotFoundLinks() {
  return (
    <ul className="mt-12 grid gap-px overflow-hidden r-md border border-line bg-line">
      {TEMPLATE_LIST.map((t) => (
        <li key={t.id}>
          <TLink
            href={t.basePath}
            className="group flex flex-col gap-2 bg-surface p-6 transition-colors duration-300 hover:bg-raised focus-visible:bg-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-baseline sm:gap-6 sm:p-7"
          >
            <span className="kicker shrink-0 text-accent sm:w-28">
              Template {t.index}
            </span>
            <span className="min-w-0">
              <span className="display block text-[1.5rem] leading-tight">
                {t.name}
                <span className="ml-2 inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="measure-prose mt-2 block text-[0.9375rem] leading-[1.65] text-muted">
                {t.blurb}
              </span>
              <span className="mt-2 block text-[0.8125rem] text-subtle">
                After {t.reference.label} — {t.reference.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </span>
          </TLink>
        </li>
      ))}
    </ul>
  );
}
