"use client";

import { useState } from "react";

import { Photo } from "@/components/shared/Photo";
import { Container, SectionHeader } from "@/components/ui";
import { business } from "@/content/site";
import { clsx } from "@/lib/clsx";
import type { TemplateId } from "@/lib/templates";

/* =============================================================================
   THE VILLA'S VIDEO
   -----------------------------------------------------------------------------
   The only video the current site has is one YouTube embed, so this is it —
   carried across rather than invented.

   It is a FACADE, and that is load-bearing in two ways. A bare <iframe> would
   contact Google on every page load, for every visitor, whether or not they
   ever press play — which would make the privacy policy's "if you play it,
   YouTube receives a request" untrue, and would add roughly a megabyte of
   third-party JavaScript to the home page's first paint.

   So until the button is pressed, this is one of our own photographs and a
   play control. `youtube-nocookie.com` is used for the same reason.
   ========================================================================== */

export function VideoBand({ tpl }: { tpl: TemplateId }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Container width={tpl === "t2" ? "wide" : "default"}>
      <SectionHeader
        tpl={tpl}
        kicker="In motion"
        title="A look around the property"
        lede="The villa's own film of the houses, the garden and the valley."
        className="mb-10 md:mb-14"
      />

      <div
        className={clsx(
          "relative overflow-hidden bg-deep",
          tpl === "t1" && "r-md",
        )}
        style={{ aspectRatio: "16 / 9" }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${business.youtubeId}?autoplay=1&rel=0`}
            title={`${business.name} — a look around the property`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            <Photo
              slug="pool-03"
              ratio={16 / 9}
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-[1200ms] ease-out-quint group-hover:scale-[1.03]"
              alt=""
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,8,0.55),rgba(10,10,8,0.12))]"
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
              <span
                aria-hidden
                className={clsx(
                  "flex h-16 w-16 items-center justify-center bg-gold text-ongold transition-transform duration-500 ease-out-quint group-hover:scale-110 md:h-20 md:w-20",
                  tpl === "t3" ? "rounded-none" : "rounded-full",
                )}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
              <span className="text-[0.8125rem] uppercase tracking-[0.18em]">
                Play the film
              </span>
            </span>
            <span className="sr-only">
              Play the {business.name} film. This loads a video player from YouTube.
            </span>
          </button>
        )}
      </div>

      <p className="mt-4 text-[0.8125rem] text-subtle">
        Pressing play loads a player from YouTube, which is a Google service with its own
        privacy policy. Nothing is requested from them before that.
      </p>
    </Container>
  );
}
