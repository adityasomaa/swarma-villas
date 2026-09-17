# Swarma Villas Bali — redesign

A redesign of [swarmavillasbali.com](https://swarmavillasbali.com): cream and deep
sage, square corners, Instrument Serif over DM Sans, photography first.

**Live:** https://swarma-villas.vercel.app

Seventeen pages, the same set as the current site plus a privacy policy and terms
of use, all statically rendered.

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/houses` | The three houses, with a side-by-side comparison |
| `/houses/wooden-gladak-house` · `/houses/hexa-bamboo-house` · `/houses/bamboo-dome` | One page per house |
| `/experiences` | Experiences |
| `/experiences/package-offer` · `/experiences/jungle-trekking` · `/experiences/swarma-paon-restaurant` · `/experiences/massage-body-rituals` | One page per experience |
| `/gallery` | Every photograph, grouped |
| `/review` | Guest reviews |
| `/contact` | Booking form |
| `/term-condition` | The villa's booking terms |
| `/privacy` · `/terms-of-use` | Privacy policy, terms of use |

### History

This started as three design directions side by side at `/template-1`,
`/template-2` and `/template-3`. The client chose **template 2** (after
[Villa Asteria](https://higher-understood-049731.framer.app/)), with one change:
the hero kicker uses the wording from template 3 — the villa's positioning line
rather than its tagline.

The three-direction build is kept under the git tag **`three-directions`**:

```bash
git checkout three-directions
```

The old preview addresses still work. `next.config.ts` redirects
`/template-1/…`, `/template-2/…` and `/template-3/…` to the same page at its new
address, because those links had already been sent to the client. The redirects
are temporary (307), not permanent: a permanent redirect is cached by browsers
with no way to take it back, and this is still a preview domain.

---

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build        # 23 static routes
npm run typecheck    # tsc, strict, noUncheckedIndexedAccess
```

To verify, build and serve on port 3100, then run the checks:

```bash
npx next build
bash scripts/serve.sh 3100
npm run verify
```

`scripts/serve.sh` restarts the production server and refuses to return until
the stylesheet the page links actually resolves. Next reads `.next` lazily, so a
server left running across a rebuild serves HTML pointing at chunks that no
longer exist — the page renders with no CSS at all, and every check after that
is measuring an unstyled document.

If Playwright's own browser download is missing, set `PW_CHANNEL=chrome` to run
the checks in the Chrome that is already installed.

---

## What is verified, and by what

Three scripts, all of which fail loudly rather than warn.

**`scripts/check-contrast.mjs`** — arithmetic on the palette tokens against
WCAG 2.2 1.4.3 (4.5:1 text) and 1.4.11 (3:1 control boundaries). **23/23 pass.**

**`scripts/audit.mjs`** — crawls all 17 pages in a real browser: exactly one `h1`
each, no skipped heading levels, an `alt` on every image, one `<main>`, an
accessible name on every control, unique titles and descriptions, no link still
pointing at a retired preview, and no horizontal overflow at 390 / 768 / 1440.
It also checks that five addresses the site does not have return a real 404,
and that five old preview links land on the right page. **17/17 pass.**

**`scripts/flow.mjs`** — behaviour a screenshot cannot show: Lenis on at
desktop and off on tablet and phone, stopped while a popup is open; no native
`<select>` or `<input type="date">` anywhere; the calendar opening from a click
24px in from the *left* edge of the field; Escape closing it and focus returning;
and the page transition running close → change → scroll → open with nothing
moving while the page is uncovered. It also samples the curtain's slowest column
on the frame before each phase ends, for both loaders, and fails if the
animation was still in flight. **22/22 pass.**

`scripts/shoot.mjs` takes full-page screenshots at any width for looking at.

---

## The two loaders

Asked for as: *page closes, page changes, scrolls to top, page opens — every
change happening while the page is closed.*

`src/components/shared/Transition.tsx` runs exactly that, and each step awaits
the one before it:

1. `setPhase("closing")` → wait for the curtain to cover the viewport
2. `setPhase("closed")` → **only now** `router.push()`
3. the new route renders → `hardScrollToTop()` → hold
4. `setPhase("opening")` → the curtain clears

Which loader plays is decided by **where you are going**, not where you are:

- **arrival** — the first load of the site, and any navigation to `/`. The logo
  rises into place on the closed curtain, then the curtain lifts.
- **page** — every other navigation. Shorter, quieter, no mark.

The curtain is three columns closing from alternating edges.

**Every duration is written once.** `TIMING` in `Transition.tsx` holds close,
hold, open and stagger for each loader and pushes them onto the curtain as
custom properties; `motion.css` contains no literal duration and derives each
column's own duration as `budget - stagger x (columns - 1)`, so the last column
lands exactly on the budget. They used to be two separate sets of numbers and
they drifted, with the JavaScript hiding the curtain while it was still sliding.
`hold` keeps the arrival curtain covered long enough for the logo to be seen,
and a 60 ms tail lets the exit complete before `visibility: hidden` applies.

Every delay goes through `lib/wait.ts`, which races `setTimeout` against
`requestAnimationFrame` — rAF stops in a backgrounded tab, and a curtain driven
by rAF alone would freeze and never reopen. `hardScrollToTop()` tells Lenis as
well as the window, because Lenis keeps its own scroll position.

The transition context is split in two: `navigate` never changes, so the four
phase changes per navigation do not re-render every link on the page.

---

## Heroes

The home hero fills one screen; every other page with a photograph opens on half
of one; in both cases the type sits **on** the photograph.

The measurement is `svh`, not `vh`. On a phone `100vh` is the height with the
address bar collapsed, so a hero sized in `vh` is taller than the screen on
arrival and its buttons sit below the fold.

The header starts transparent over the photograph with the **reversed** logo and
switches to the full-colour logo once it is on its own cream ground. The logo's
olive lettering cannot be read on a photograph, and the reversed cut's cream
lettering cannot be read on cream. Contact, privacy, terms of use and the 404
have no photograph; they get a typographic opening and a solid header. The hero
declares itself with `data-hero="dark"` and the header asks the document once per
navigation.

`Photo` takes a `fill` prop rather than accepting `absolute` through
`className`. Which of `relative` (the component's own) and `absolute` (the
caller's) applies is decided by the order Tailwind emits them, not the order
they are written — passed as a class, a hero photograph kept its ratio box in
the flow and doubled the height of its section. The header's Book direct button
has the same problem with `hidden` and `inline-flex`, which is why its
responsive display sits on a wrapper.

---

## Buttons

Hover is not a background swap. A fill sweeps in from the left with a slight
skew while the label rolls up and out and an identical copy rolls in from below.
The copy carries `aria-hidden`, so a screen reader announces the name once.
`:focus-visible` gets the same treatment as `:hover`; `@media (hover: none)`
removes the motion on touch, where `:hover` is a sticky state after a tap.

---

## Colour, and the brand gold

The palette comes from the logo, a single-colour gold mark: **#FCD403**. It
measures 1.27:1 on the cream, so it is used the only ways it works:

- **as a fill** carrying deep sage type — 9.2:1;
- **as text on dark grounds**, where `.on-deep` and `.on-photo` flip
  `--c-accent` back to it;
- **as rules and marks**, where 1.4.11 does not apply.

For links and kickers on light grounds there is a text-safe bronze descendant,
`--c-accent` (#6b5200).

Two tokens look like they should be one. `--c-field` draws **control
boundaries** and needs 3:1; `--c-subtle` sets **small print** and needs 4.5:1.
One value cannot satisfy both without failing the text or darkening every
hairline on the site.

### The logo

The logo is a stacked, full-colour mark — a gold S round a palm leaf, SWARMA in
deep olive, VILLAS in gold — and ships in two cuts:

- **color** (`public/brand/logo.png`) — the supplied artwork, for light grounds.
- **reversed** (`public/brand/logo-reversed.png`) — made from the supplied file
  by classifying each pixel: gold stays exactly as supplied, everything else
  (SWARMA, the leaf, the small print) becomes cream. For photographs, the footer,
  the mobile menu and both loaders.

Both come at 1x and 2x. Being stacked, it is set tall — 72 px in the header at the
top of a page, 56 px once scrolled — so SWARMA stays legible. Logo type is
exempt from WCAG contrast; the image's alt text carries the name.

The site icon is the S-and-leaf mark on its own: `src/app/icon.png` at 256 px
with a transparent ground, and `src/app/apple-icon.png` on the cream, because
iOS fills transparency with black.

**`@theme inline` is load-bearing.** A plain `@theme` resolves
`--color-ink: var(--c-ink)` at build time into one hex. `.on-photo` and
`.on-deep` redefine the palette for their subtrees, and `inline` is what lets
`text-ink` inside a hero resolve to white rather than staying deep sage.

The font class sits on `<html>`, because next/font defines its variables on the
element carrying the class, and the calendar and lightbox render through portals
into `<body>`.

---

## Content

**`src/content/site.ts` is the single source.** It is written to be edited by
someone who does not write code.

Everything in it was taken from swarmavillasbali.com on 3 September 2026. Nothing
was invented. Two kinds of edit were made and only these two: spelling and
grammar fixes (*Avaibility* → *Availability*, *Abouts us* → *About us*,
*cencellation* → *cancellation*), and sentences split or joined for reading.

- **The rating.** The villa publishes 4.5 out of 5 on its own room pages; it is
  carried across attributed as their claim.
- **The reviews.** Two, because two is the honest number. The current review page
  also carries a spam entry, which is not reproduced.
- **Availability.** There is no booking system behind the site, and the pages
  where someone might assume otherwise say so.
- **Two phone numbers.** The villa lists a reservations line *and* a separate
  WhatsApp number. Messages go to the WhatsApp one; the phone number is only a
  `tel:` link.

**Privacy policy and terms of use** are the only pages whose text is not from the
current site. They describe what this build actually does — no analytics, no
advertising pixel, no third-party script, three named `localStorage` keys,
self-hosted fonts, one YouTube embed disclosed as a third party. They are not
legal advice; before the site moves to the villa's own domain, have them read
against Indonesian PDP Law No. 27/2022 and, if the villa markets into the EU or
UK, the GDPR.

---

## Photography

Everything is the villa's own, taken from its WordPress media library through
the REST API. The library holds **156 images**; **108** are published. The rest
are theme demo photographs — Maldives bungalows, Portofino yachts, stock
concierges — that would misrepresent a jungle villa in Ubud.
`scripts/optimise-photos.mjs` carries the kept list with a caption for each.

Each is encoded to WebP at up to four widths (480 / 960 / 1600 / 2400) and
served as static files with a `srcset`. `images.unoptimized` is set on purpose:
the Vercel image optimizer quota on this account is exhausted, and with it on
every image returns 402 and the site renders blank.

**Video:** the current site's one YouTube embed is carried across as a facade —
a photograph and a play button. A bare `<iframe>` would contact Google on every
page load, which would make the privacy policy untrue.

---

## Forms

No native `<select>` and no native `<input type="date">` anywhere.

- **`Listbox`** is a full ARIA listbox: arrow keys, Home/End, type-ahead,
  Enter/Space, Escape, focus returned to the trigger.
- **`DateField`** makes the **entire field** the trigger, not only the icon. The
  panel renders through a portal so an `overflow: hidden` ancestor cannot clip it.

Validation runs as you type and again on the server; the server copy decides.
Failing validation never clears a field and never scrolls to the top.

Submitting opens WhatsApp with the message already written, carrying the page
and the button that was pressed. `src/lib/booking/store.ts` is an adapter with a
working `localStorage` implementation and an empty `createDatabaseStore` seam.

---

## Cookie settings

A working feature. **Manage** lists every `localStorage` key by name.
**Decline** deletes what is already stored, immediately. The choice can be
changed from *Cookie settings* in the footer of every page.

---

## Smooth scrolling

Lenis, on at desktop and **off on tablet and phone**. The gate is
`min-width: 1024px` **and** `pointer: fine` **and** not
`prefers-reduced-motion`. It stops whenever a menu, calendar or lightbox is open.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict with
`noUncheckedIndexedAccess` · Tailwind CSS v4 · Zod · Lenis · `next/font`
(self-hosted) · Vercel.

```
src/
  app/                      one folder per page, plus layout, 404, sitemap, robots
  components/
    blocks/                 page sections
    chrome/                 Header, Footer, Logo
    form/                   Listbox, DateField, BookingForm
    shared/                 Transition, SmoothScroll, Photo, cookie settings
    ui/                     primitives
  content/
    site.ts                 EVERY fact, from the current site
    legal.ts                privacy policy + terms of use
    photos.json             the 108 photographs, with captions
  lib/                      format, seo, whatsapp, wait, fonts
scripts/                    crawl, fetch, optimise, audit, contrast, flow, shoot, serve
```

---

## Before it moves to the villa's domain

- **`robots.ts` disallows the host and the layout sends `noindex`.** A second
  copy of the villa's own copy on vercel.app would compete with
  swarmavillasbali.com in search. Remove both together on the day of the move,
  and change `SITE_URL` in `src/lib/seo.ts`.
- **The current site's house pages live at `/house/<slug>`** (singular); this
  site uses `/houses/<slug>`. Add redirects from the old addresses so existing
  links and search results keep working.
