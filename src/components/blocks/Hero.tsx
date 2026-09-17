import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { Button, Container } from "@/components/ui";
import { business, copy, cta } from "@/content/site";

/* =============================================================================
   THE OPENING
   -----------------------------------------------------------------------------
   One photograph, full height, with the name set across its bottom-left corner.

   The kicker is the villa's positioning line rather than its tagline — the
   client asked for this wording specifically.

   HEIGHT. `100svh`, the *small* viewport height. On a phone `100vh` is the
   height with the address bar collapsed, so a hero sized in vh is taller than
   the screen on arrival and its buttons sit below the fold until you scroll.

   THE SCRIM. Type on a photograph needs a gradient underneath it. Without one
   the contrast depends on which part of a jungle happens to be bright that day,
   and jungle is reliably light and dark in the same frame.

   `data-hero="dark"` tells the header it is sitting on a photograph, so it can
   start transparent with the gold wordmark.
   ========================================================================== */

const FULL = "min-h-svh";

export function Hero() {
  return (
    <section data-hero="dark" className={`relative isolate w-full ${FULL}`}>
      <Photo
        slug="pool-02"
        priority
        fill
        sizes="100vw"
        className="-z-10"
        imgClassName="object-center"
        alt="The pool at Swarma Villas, surrounded by jungle planting"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(24,30,10,0.8)_0%,rgba(24,30,10,0.34)_46%,rgba(24,30,10,0.3)_100%)]"
      />

      <div className={`on-photo relative flex flex-col justify-end ${FULL}`}>
        <Container width="wide" className="pt-32 pb-16 md:pb-24">
          <Reveal>
            <p className="kicker">{business.positioning}</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display mt-5 max-w-5xl text-[clamp(2.5rem,8.5vw,6.5rem)] leading-[0.94]">
              {copy.home.h1}
            </h1>
          </Reveal>
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={200}>
              <p className="max-w-md text-[1.0625rem] leading-[1.7] opacity-90">
                {copy.home.lede}
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="flex flex-wrap gap-3">
                <Button href={cta.primary.href}>{cta.primary.label}</Button>
                <Button href="/houses" tone="outline">
                  The houses
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
