import { TLink } from "@/components/shared/Transition";
import { business } from "@/content/site";
import { clsx } from "@/lib/clsx";
import { href, type TemplateId } from "@/lib/templates";

/* =============================================================================
   THE MARK
   -----------------------------------------------------------------------------
   The supplied logo is a single-colour gold mark. Gold measures 1.44:1 on white
   and 1.35:1 on the Amber cream, so the gold artwork can only be used where the
   ground is dark. Two one-colour versions were derived from its alpha channel —
   same artwork, different ink — and `tone` picks the one that can actually be
   read on the ground it lands on:

     gold   dark bands and photographs. The brand asset as supplied.
     ink    light headers. Near-black, 14:1 on cream.
     cream  inside .on-deep sections and the footers.

   The image is fixed height and auto width, so no template can squash it.
   ========================================================================== */

const FILES = {
  gold: { src: "/brand/logo.png", srcSet: "/brand/logo.png 1x, /brand/logo@2x.png 2x" },
  ink: { src: "/brand/logo-ink.png", srcSet: "/brand/logo-ink.png 1x, /brand/logo-ink@2x.png 2x" },
  cream: {
    src: "/brand/logo-cream.png",
    srcSet: "/brand/logo-cream.png 1x, /brand/logo-cream@2x.png 2x",
  },
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
  tpl,
  tone,
  height,
  className,
}: {
  tpl: TemplateId;
  tone?: keyof typeof FILES;
  height?: number;
  className?: string;
}) {
  return (
    <TLink
      href={href(tpl)}
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
