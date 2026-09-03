/* =============================================================================
   THE THREE PREVIEWS
   -----------------------------------------------------------------------------
   Three complete websites live in one project, each under its own path prefix.
   Nothing outside those prefixes exists: `/`, `/about` and every other bare
   route returns 404 by design (see src/app/not-found.tsx).

   No component ever writes a path by hand. It asks `href()` with its own
   template id, so a link cannot accidentally point into a different preview.
   The audit crawls every rendered page and fails the build if one does.
   ========================================================================== */

export type TemplateId = "t1" | "t2" | "t3";

export type TemplateMeta = {
  id: TemplateId;
  basePath: string;
  index: 1 | 2 | 3;
  name: string;
  /** The reference this direction was built from. */
  reference: { label: string; url: string };
  blurb: string;
};

export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  t1: {
    id: "t1",
    basePath: "/template-1",
    index: 1,
    name: "Amber",
    reference: { label: "Vantara", url: "https://vantara.framer.website/" },
    blurb:
      "Warm cream and bronze. A floating pill navigation, a split opening with " +
      "the photograph bleeding off the right edge, and glass cards that overlap " +
      "it. Cormorant Garamond, large and light.",
  },
  t2: {
    id: "t2",
    basePath: "/template-2",
    index: 2,
    name: "Riverstone",
    reference: { label: "Villa Asteria", url: "https://higher-understood-049731.framer.app/" },
    blurb:
      "Cream and deep sage, square corners, no shadows. A full-bleed photograph " +
      "with the name set over its bottom-left corner and a transparent header. " +
      "Instrument Serif at its largest.",
  },
  t3: {
    id: "t3",
    basePath: "/template-3",
    index: 3,
    name: "Paon",
    reference: { label: "Villa L", url: "https://villa-l.framer.website/" },
    blurb:
      "White, hairlines and Lora throughout. A two-row classic hotel header with " +
      "the wordmark centred above the navigation, and photographs left to speak " +
      "without type on them.",
  },
};

export const TEMPLATE_IDS: TemplateId[] = ["t1", "t2", "t3"];
export const TEMPLATE_LIST = TEMPLATE_IDS.map((id) => TEMPLATES[id]);

/** Build a path inside one preview. `href("t2", "/houses")` -> "/template-2/houses". */
export function href(id: TemplateId, path = ""): string {
  return `${TEMPLATES[id].basePath}${path}`;
}

/** Which preview a pathname belongs to, or null for anything outside them. */
export function templateFromPath(pathname: string): TemplateId | null {
  for (const id of TEMPLATE_IDS) {
    const base = TEMPLATES[id].basePath;
    if (pathname === base || pathname.startsWith(`${base}/`)) return id;
  }
  return null;
}
