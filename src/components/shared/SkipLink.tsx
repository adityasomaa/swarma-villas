/**
 * Skip link. It sits at the very top of the stacking scale so it cannot be
 * covered by the header, a menu or the cookie banner — being the
 * first thing a keyboard user reaches, it has to win against everything.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="z-skip-link sr-only-x focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:h-auto focus:w-auto focus:bg-gold focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-ongold focus:[clip-path:none]"
    >
      Skip to main content
    </a>
  );
}
