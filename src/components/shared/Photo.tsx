import photos from "@/content/photos.json";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   PHOTO — the only way a photograph reaches the page.
   -----------------------------------------------------------------------------
   Every image is one of the villa's own, downloaded from the current site,
   curated by hand (see scripts/optimise-photos.mjs) and pre-encoded to WebP at
   four widths.

   It is a plain <img>, not next/image, on purpose: Vercel's image optimizer is
   switched off on this account — the quota is exhausted and every optimized
   request returns 402, which renders a blank page — so the responsive sizes are
   generated at build-prep time and served as static files. next/image would
   ship extra client JavaScript to do nothing.

   The wrapper carries the real aspect ratio, so the space is reserved before
   the file arrives and the layout never jumps.
   ========================================================================== */

export type PhotoRecord = {
  slug: string;
  category: string;
  caption: string;
  w: number;
  h: number;
  ratio: number;
  orientation: string;
  sizes: { w: number; file: string; kb: number }[];
};

const BY_SLUG = new Map((photos as PhotoRecord[]).map((p) => [p.slug, p]));

export function photo(slug: string): PhotoRecord | undefined {
  return BY_SLUG.get(slug);
}

/** Every photo in a category, in manifest order. */
export function photosIn(category: string): PhotoRecord[] {
  return (photos as PhotoRecord[]).filter((p) => p.category === category);
}

export const allPhotos = photos as PhotoRecord[];

type Props = {
  /** Slug from src/content/photos.json. */
  slug: string;
  /** Overrides the manifest caption. Use when context makes a better sentence. */
  alt?: string;
  /** Above the fold: loads eagerly and at high priority. */
  priority?: boolean;
  sizes?: string;
  /** Applied to the ratio box. */
  className?: string;
  /** Applied to the <img>. Use for object-position. */
  imgClassName?: string;
  /**
   * Force a display ratio instead of the photograph's own. The box crops with
   * object-fit; the file is untouched.
   */
  ratio?: number;
  /** Rounds the corners with the template's own radius token. */
  rounded?: "none" | "sm" | "md";
  /**
   * Fill the nearest positioned ancestor instead of holding a ratio box.
   *
   * This is a PROP rather than something a caller passes through `className`,
   * because `position` can only be set once. The box is `relative` by default,
   * and an `absolute` arriving in `className` does not reliably win — which of
   * the two applies is decided by the order Tailwind emits them, not by the
   * order they were written. A hero photo laid out that way silently kept its
   * ratio box in the flow and doubled the height of the section it was meant
   * to sit behind. Setting it here removes the conflict entirely.
   */
  fill?: boolean;
};

export function Photo({
  slug,
  alt,
  priority = false,
  sizes = "100vw",
  className,
  imgClassName,
  ratio,
  rounded = "none",
  fill = false,
}: Props) {
  const record = BY_SLUG.get(slug);

  if (!record) {
    // A missing slug is a content bug, not a runtime one. Fail loudly in
    // development and render nothing in production rather than a broken icon.
    if (process.env.NODE_ENV !== "production") {
      throw new Error(`Photo: no photograph with slug "${slug}" in photos.json`);
    }
    return null;
  }

  const srcSet = record.sizes.map((s) => `/img/${s.file} ${s.w}w`).join(", ");
  // The widest encode is the src, for anything that ignores srcSet.
  const largest = record.sizes[record.sizes.length - 1];
  if (!largest) return null;

  return (
    <div
      className={clsx(
        "overflow-hidden bg-raised",
        fill ? "absolute inset-0 h-full w-full" : "relative",
        rounded === "sm" && "r-sm",
        rounded === "md" && "r-md",
        className,
      )}
      // A filling photo takes its size from its ancestor; a ratio would fight it.
      style={fill ? undefined : { aspectRatio: String(ratio ?? record.ratio) }}
    >
      <img
        src={`/img/${largest.file}`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt ?? record.caption}
        width={record.w}
        height={record.h}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={clsx("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
