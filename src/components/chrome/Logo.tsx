import { TLink } from "@/components/shared/Transition";
import { business } from "@/content/site";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   THE MARK
   -----------------------------------------------------------------------------
   The supplied logo is a single-colour gold mark. Gold measures 1.27:1 on the
   cream, so the gold artwork can only be used where the ground is dark. A
   near-black version was derived from its alpha channel — same artwork,
   different ink — and `tone` picks the one that can be read on the ground it
   lands on:

     gold   dark bands and photographs. The brand asset as supplied.
     ink    the header once it is on its own light ground.

   The image is fixed height and auto width, so no layout can squash it.
   ========================================================================== */

const FILES = {
  gold: { src: "/brand/logo.png", srcSet: "/brand/logo.png 1x, /brand/logo@2x.png 2x" },
  ink: { src: "/brand/logo-ink.png", srcSet: "/brand/logo-ink.png 1x, /brand/logo-ink@2x.png 2x" },
} as const;

export function LogoImage({
  tone = "ink",
  height = 34,
  className,
}: {
  tone?: keyof typeof FILES;
  height?: number;
  className?: string;
}) {
  const file = FILES[tone];
  return (
    <img
      src={file.src}
      srcSet={file.srcSet}
      alt={business.name}
      width={Math.round((249 / 98) * height)}
      height={height}
      style={{ height, width: "auto" }}
      className={clsx("w-auto", className)}
      // The mark is above the fold in every header.
      fetchPriority="high"
      decoding="async"
    />
  );
}

/** The mark, wrapped in a link home. Every header uses this. */
export function LogoLink({
  tone,
  height,
  className,
}: {
  tone?: keyof typeof FILES;
  height?: number;
  className?: string;
}) {
  return (
    <TLink
      href="/"
      aria-label={`${business.name} — home`}
      className={clsx(
        "inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-75",
        className,
      )}
    >
      <LogoImage tone={tone} height={height} />
    </TLink>
  );
}
