import { TLink } from "@/components/shared/Transition";
import { business } from "@/content/site";
import { clsx } from "@/lib/clsx";

/* =============================================================================
   THE MARK
   -----------------------------------------------------------------------------
   The logo is a stacked, full-colour mark: a gold S wrapped round a palm leaf,
   SWARMA in deep olive, VILLAS and its rules in gold, UBUD • BALI beneath.

   Deep olive disappears on a dark ground, so there are two cuts of the same
   artwork, and `tone` picks the one that can be read where it lands:

     color     the supplied artwork, for light grounds — the solid header.
     reversed  gold kept exactly as supplied; SWARMA, the leaf and the small
               print in cream. For photographs, the footer and the mobile menu.

   The reversed cut is made from the supplied file by classifying each pixel as
   gold or not, so the gold is the original gold rather than an approximation.

   Size is set with a height class and the width follows from the intrinsic
   ratio carried by the width/height attributes, so no layout can squash it and
   the space is reserved before the image arrives.
   ========================================================================== */

const FILES = {
  color: { src: "/brand/logo.png", srcSet: "/brand/logo.png 1x, /brand/logo@2x.png 2x" },
  reversed: {
    src: "/brand/logo-reversed.png",
    srcSet: "/brand/logo-reversed.png 1x, /brand/logo-reversed@2x.png 2x",
  },
} as const;

/** The supplied artwork is 495 x 316. */
const RATIO = { width: 157, height: 100 };

export type LogoTone = keyof typeof FILES;

export function LogoImage({
  tone = "color",
  className = "h-12",
  onPhoto = false,
}: {
  tone?: LogoTone;
  /** A height class, e.g. "h-14 md:h-16". */
  className?: string;
  /**
   * Adds a soft shadow under the mark. A photograph behind a logo is light in
   * some places and dark in others; the shadow keeps the cream letters off the
   * bright patches without a visible box.
   */
  onPhoto?: boolean;
}) {
  const file = FILES[tone];
  return (
    <img
      src={file.src}
      srcSet={file.srcSet}
      alt={business.name}
      width={RATIO.width}
      height={RATIO.height}
      className={clsx(
        "w-auto max-w-none transition-[height,filter] duration-500 ease-out-quint",
        onPhoto && "drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]",
        className,
      )}
      // The mark is above the fold in every header.
      fetchPriority="high"
      decoding="async"
    />
  );
}

/** The mark, wrapped in a link home. The header uses this. */
export function LogoLink({
  tone,
  className,
  imageClassName,
  onPhoto,
}: {
  tone?: LogoTone;
  className?: string;
  imageClassName?: string;
  onPhoto?: boolean;
}) {
  return (
    <TLink
      href="/"
      aria-label={`${business.name} — home`}
      className={clsx(
        "inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-80",
        className,
      )}
    >
      <LogoImage tone={tone} className={imageClassName} onPhoto={onPhoto} />
    </TLink>
  );
}
