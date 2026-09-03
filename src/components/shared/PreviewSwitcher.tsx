"use client";

import { usePathname } from "next/navigation";

import { useTemplateNav } from "@/components/shared/Transition";
import { useUI } from "@/components/shared/UIProvider";
import { clsx } from "@/lib/clsx";
import { TEMPLATE_LIST, templateFromPath } from "@/lib/templates";

/* =============================================================================
   PREVIEW SWITCHER
   -----------------------------------------------------------------------------
   NOT part of any of the three designs, and not part of the redesign being
   proposed. It is scaffolding for the review: the brief asks for three previews
   at /template-1..3 and for every route outside them to 404, which leaves no
   page on which to put a chooser. This bar is the answer — it rides above all
   three so you can jump between directions without editing the address bar.

   It carries `data-preview-chrome` so scripts/audit.mjs can exclude it from
   every design measurement it takes.

   Delete this component and its two lines in the root layout to ship a single
   direction; nothing else references it.
   ========================================================================== */

export function PreviewSwitcher() {
  const pathname = usePathname();
  const current = templateFromPath(pathname);
  const { menuOpen } = useUI();
  const switchTemplate = useTemplateNav();

  return (
    <div
      data-preview-chrome
      aria-hidden={menuOpen}
      className={clsx(
        "fixed inset-x-0 top-0 z-template-switcher h-(--switcher-h)",
        "flex items-center justify-center gap-1 px-2",
        "bg-[#12100b] text-[11px] tracking-[0.14em] text-white/60 uppercase",
        "transition-opacity duration-200 sm:text-[12px]",
        // Steps out of the way of the mobile menu rather than fighting it.
        menuOpen && "pointer-events-none opacity-0",
      )}
    >
      <span className="hidden pr-2 sm:inline">Design preview</span>
      <nav aria-label="Design directions" className="flex items-center gap-1">
        {TEMPLATE_LIST.map((t) => {
          const active = t.id === current;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => switchTemplate(t.id)}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "rounded-full px-2.5 py-1 transition-colors duration-200 sm:px-3",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fcd403]",
                active
                  ? "bg-[#fcd403] text-[#16130c]"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="sm:hidden">{t.index}</span>
              <span className="hidden sm:inline">
                {t.index}. {t.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
