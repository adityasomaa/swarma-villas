# Swarma Villas Bali — redesign, three directions

A proposed redesign of [swarmavillasbali.com](https://swarmavillasbali.com), built
three ways in one project so the three can be compared side by side rather than
described.

**Live:** https://swarma-villas.vercel.app

| | Direction | After | Character |
|---|---|---|---|
| 1 | **Amber** | [Vantara](https://vantara.framer.website/) | Warm cream and bronze, a floating pill navigation, rounded cards, Cormorant Garamond set large and light. |
| 2 | **Riverstone** | [Villa Asteria](https://higher-understood-049731.framer.app/) | Cream and deep sage, square corners, no shadows, a full-bleed opening photograph with Instrument Serif over it. |
| 3 | **Paon** | [Villa L](https://villa-l.framer.website/) | White, hairlines and Lora throughout, a two-row hotel header with the wordmark centred above the navigation. |

Each direction is a complete site: **17 pages × 3 = 51 routes**, all statically
rendered.

---

## The 404 rule

Every route outside `/template-1`, `/template-2` and `/template-3` returns a real
404 — `/`, `/about`, `/houses`, `/template-4`, an invented house slug, everything.

That is not a redirect or a catch-all page with a 200 status; `scripts/audit.mjs`
asserts the status code. Three things implement it together:

- there is no `src/app/page.tsx`, so the bare origin has no route to match;
- `dynamicParams = false` on `[template]`, `[house]` and `[experience]` means
  only the slugs in `generateStaticParams` exist;
- `src/app/not-found.tsx` catches the rest and offers the three doors.

Since `/` is a 404 there is nowhere to put a chooser, so the dark strip across
the top of every page is **`PreviewSwitcher`** — review scaffolding, not part of
any of the three designs. It carries `data-preview-chrome`, which is how the
audit excludes it from every measurement. Delete the component and its two lines
in `src/app/layout.tsx` to ship a single direction; nothing else refers to it.

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000/template-1 — not `/`, which is a 404 by design.

```bash
npm run build        # 57 static routes
npm run typecheck    # tsc, strict, noUncheckedIndexedAccess
npm run verify       # contrast + audit + behaviour, against a running build
```

`verify` expects a production build on port 3100:

```bash
npx next build && npx next start -p 3100
```

---

## What is verified, and by what

Three scripts, all of which fail loudly rather than warn.

**`scripts/check-contrast.mjs`** — arithmetic on the palette tokens, not a
screenshot reading. Checks every colour pair the three palettes actually put
together against WCAG 2.2 1.4.3 (4.5:1 text) and 1.4.11 (3:1 control
boundaries). **69/69 pass.**

**`scripts/audit.mjs`** — crawls all 51 pages in a real browser and checks
exactly one `h1` each, no skipped heading levels, no link that escapes its own
preview, an `alt` on every image, one `<main>`, an accessible name on every
control, unique titles and descriptions within a preview, and no horizontal
overflow at 390 / 768 / 1440. It also asserts the 404 rule. **51/51 pass.**

**`scripts/flow.mjs`** — the behaviour that a screenshot cannot show: that Lenis
is on at desktop and off on tablet and phone, that it stops while a popup is
open, that there is no native `<select>` or `<input type="date">` anywhere, that
the calendar opens from a click 24px in from the *left* edge of the field, that
Escape closes it and focus returns, and that the page transition really does run
close → change → scroll → open with nothing moving while the page is uncovered.

It also samples the curtain's **slowest panel** on the frame before each phase
ends, for all three families and both variants, and fails if the animation was
still in flight when the phase closed. That check exists because the curtain
used to be cut off mid-slide in five of the twelve phases. **34/34 pass.**

`scripts/serve.sh` restarts the production server and refuses to return until
the stylesheet the page links actually resolves. Next reads `.next` lazily, so a
server left running across a rebuild serves HTML pointing at chunks that no
longer exist — the page renders with no CSS at all, and every visual check after
that is measuring an unstyled document.

`scripts/shoot.mjs` takes full-page screenshots at any width for looking at.

---

## The two loaders

Asked for as: *page closes, page changes, scrolls to top, page opens — every
change happening while the page is closed.*

`src/components/shared/Transition.tsx` runs exactly that, and each step awaits
the one before it:

1. `setPhase("closing")` → wait for the curtain to cover the viewport
2. `setPhase("closed")` → **only now** `router.push()`
3. the new route renders → `hardScrollToTop()` → a beat so it paints
4. `setPhase("opening")` → the curtain clears

Which loader plays is decided by **where you are going**, not where you are:

- **arrival** — the first load of the site, and any navigation that lands on a
  template home. The logo feather draws in gold, the name sets, the curtain
  lifts.
- **page** — every other navigation. Shorter, quieter, no wordmark.

Each direction has its own curtain: one warm sheet for Amber, three columns
closing from alternating edges for Riverstone, five panels with gold hairlines
for Paon.

**Every duration is written once.** `TIMING` in `Transition.tsx` holds the close,
hold, open and stagger for each family and variant, and pushes them onto the
curtain element as custom properties; `motion.css` contains no literal duration
and derives each panel's own duration as `budget - stagger x (panels - 1)`, so
the last panel lands exactly on the budget. They used to be two separate sets of
numbers and they drifted: five of the twelve phases had the JavaScript hide the
curtain while its panels were still sliding. `hold` is the other half of that
fix — the arrival curtain now stays covered long enough for the feather to
finish drawing rather than being cut wherever the router happened to finish.

Two details worth knowing about. Every delay goes through `lib/wait.ts`, which
races `setTimeout` against `requestAnimationFrame` — rAF stops in a backgrounded
tab, and a curtain driven by rAF alone would freeze mid-close and never reopen.
And `hardScrollToTop()` tells Lenis as well as the window, because Lenis keeps
its own scroll position and telling only one leaves the next wheel event to snap
back.

---

## Heroes

Every home hero fills one screen; every inner-page hero fills half of one; and in
both cases the type sits **on** the photograph rather than above it.

The measurement is `svh`, not `vh`. On a phone `100vh` is the height with the
address bar collapsed, so a hero sized in `vh` is taller than the screen on
arrival and its buttons sit below the fold until you scroll.

Because every hero is a dark photograph, all three headers start transparent over
it with the **gold** wordmark, and switch to the near-black cut the moment they
land on their own light ground. Gold is 1.44:1 on cream and cannot be read there,
so this is the only arrangement in which the brand mark is both used and legible.

Privacy, terms of use and contact have no photograph. They get a plain
typographic opening on the canvas and a solid header — half a screen of empty
colour would be a worse page, not a more consistent one. The hero declares itself
with `data-hero="dark"` and the header asks the document once per navigation,
because the two are siblings in the layout with no other way to talk.

`Photo` takes a `fill` prop rather than accepting `absolute` through `className`:
`position` can only be set once, and which of `relative` (the component's own)
and `absolute` (the caller's) applies is decided by the order Tailwind emits
them. Passed as a class, a hero photograph silently kept its ratio box in the
flow and doubled the height of the section it was meant to sit behind.

---

## Buttons

Hover is not a background swap. Two things move together: a **wipe** that grows
into the button from a direction, and a **roll** where the label leaves and an
identical copy arrives from the opposite side.

- **Amber** — the gold wipes up from the bottom, the label rolls up.
- **Riverstone** — the wipe sweeps in from the left with a skew, the label rolls up.
- **Paon** — the wipe grows out of a hairline at the bottom, the label slides sideways.

The label is rendered twice; the copy carries `aria-hidden`, so a screen reader
announces the name once. `:focus-visible` gets the same treatment as `:hover`, so
a keyboard reaches the same interface a mouse does, and `@media (hover: none)`
removes the motion on touch, where `:hover` is a sticky state after a tap rather
than a hover.

---

## Colour, and the brand gold

The palette is derived from the logo, which is a single-colour gold mark:
**#FCD403**.

That colour measures **1.44:1 on white** and **1.35:1 on the Amber cream**. It
cannot carry text on a light ground, and no amount of wanting it to changes that.
So it is used the only way it works:

- **as a fill** carrying near-black type — 12.9:1, the strongest pair in the
  whole system;
- **as text on dark bands**, where `.on-deep` flips `--c-accent` back to the gold;
- **as rules and marks**, where it is decoration and 1.4.11 does not apply.

For links and kickers on light grounds there is a text-safe bronze descendant
(`--c-accent`, #7a5d00 / #6b5200 — 5.5:1 to 7.4:1).

Two tokens exist that look like they should be one:

- `--c-field` draws **control boundaries** and needs 3:1 (WCAG 1.4.11);
- `--c-subtle` sets **small print** and needs 4.5:1 (1.4.3).

They were one token until the contrast script caught eight failures: a single
value cannot satisfy both without either failing the text or darkening every
hairline in all three designs until they look like a form.

The logo itself ships in three one-colour versions, generated from the alpha
channel of the supplied artwork — gold for dark grounds, near-black for light
headers, cream for the footers.

### `@theme inline` is load-bearing

`src/app/globals.css` uses `@theme inline`, not `@theme`. A plain `@theme`
resolves `--color-ink: var(--c-ink)` at build time into one hard-coded hex —
whichever template happens to define the `:root` fallback — and every other
template silently renders in it. `inline` emits `color: var(--c-ink)` and lets
the variable resolve against whichever `[data-tpl]` subtree the element is in.
That single keyword is what keeps three design systems apart in one stylesheet.

For the same reason the typeface is set on `[data-tpl]` and never on `<body>`:
`next/font` defines its CSS variable on the element carrying the font class, and
a `font-family` on `<body>` pointing at it resolves to nothing.

---

## Content

**`src/content/site.ts` is the single source.** Every fact in all three
directions comes from it — change it once and all three update together. It is
written to be edited by someone who does not write code.

Everything in it was taken from swarmavillasbali.com on 3 September 2026: the
page copy, the room specifications, the published rates, the booking terms and
the contact details. **Nothing was invented.** Two kinds of edit were made to the
source wording and only these two:

1. spelling and grammar fixed where the original had slips
   (*Avaibility* → *Availability*, *Abouts us* → *About us*, *cencellation* →
   *cancellation*);
2. sentences split or joined for reading.

No claim was added, removed or strengthened anywhere.

Some specific decisions:

- **The rating.** The villa publishes 4.5 out of 5 on its own room pages. It is
  carried across attributed as their claim, never as something this site
  measured.
- **The reviews.** Two, because two is the honest number. The current site's
  review page also carries a third entry that is spam — a random string
  submitted through an open form — and it is not reproduced.
- **Availability.** This site has no connection to a booking system and says so
  on the pages where someone might assume otherwise. Choosing dates does not
  hold a room.
- **Two phone numbers.** The villa lists a reservations line *and* a separate
  WhatsApp number. Messages go to the WhatsApp one; the phone number is only ever
  a `tel:` link. `src/lib/whatsapp.ts` has a comment about this, because getting
  them the wrong way round sends every enquiry to a phone with no WhatsApp on it.

### Privacy policy and terms of use

The only two pages whose text is **not** from the current site — it does not
carry either, and both were asked for. They describe what this build actually
does, and every claim is checkable against the code: no analytics, no advertising
pixel, no third-party script, three named `localStorage` keys, self-hosted fonts,
and one YouTube embed that is disclosed as a third party.

They are not legal advice. Before this goes live under the villa's own domain,
have someone qualified read them against Indonesian PDP Law No. 27/2022 and, if
the villa markets into the EU or UK, the GDPR.

---

## Photography

Everything is the villa's own, taken from its WordPress media library through the
REST API — the rendered pages only expose scaled thumbnails whose originals
cannot be derived.

The library holds **156 images**. **108** are published here.

The 48 that are not are theme demo photographs that shipped with the WordPress
template the current site uses: Maldives overwater bungalows, Portofino yachts,
the Ligurian coast, grey European apartments, stock concierges, a mini-golf
course. Publishing those would misrepresent a jungle villa in Ubud. Every kept
image was looked at on a contact sheet and confirmed to be this property;
`scripts/optimise-photos.mjs` carries the list with a caption for each.

Each is encoded to WebP at up to four widths (480 / 960 / 1600 / 2400, quality
76) and served as static files with a `srcset` — 264 files, 59 MB.

`images.unoptimized` is set in `next.config.ts` on purpose: the Vercel image
optimizer quota on this account is exhausted, and with it on every image returns
402 and production renders blank. The sizes are pre-generated, so the optimizer
would buy nothing anyway.

**Video:** the current site's only video is one YouTube embed, and it is carried
across as a **facade** — one of our own photographs and a play button. A bare
`<iframe>` would contact Google on every page load whether or not anyone pressed
play, which would both add roughly a megabyte to the home page and make the
privacy policy untrue.

---

## Forms

No native `<select>` and no native `<input type="date">` anywhere on the site —
`scripts/flow.mjs` asserts a count of zero for both.

- **`Listbox`** is a full ARIA listbox: arrow keys, Home/End, type-ahead with a
  600 ms buffer, Enter/Space, Escape, and focus returned to the trigger.
- **`DateField`** makes the **entire field** the trigger, not the icon — the
  brief's point 12, and the flow test clicks 24 px in from the left edge to prove
  it. The panel renders through a portal into `<body>` so it is not clipped by an
  `overflow: hidden` ancestor.

Validation runs in the browser as you type *and* again on the server, and the
server copy is the one that decides. Failing validation never clears a field and
never scrolls to the top: the first invalid control is focused where it stands,
with `scroll-margin-top` set so it does not land under the sticky header.

Submitting opens WhatsApp with a message already written, carrying the page, the
preview and the button that was pressed — so once the client is clicking through
all three, the villa's inbox becomes the measurement of which direction people
actually use.

`src/lib/booking/store.ts` is an adapter with one working implementation
(`localStorage`) and one empty seam (`createDatabaseStore`). Nothing else in the
codebase touches storage, so wiring a real backend means filling in four methods
and flipping one line.

---

## Cookie settings

A working feature, not a notice. Two levels: **Manage** opens a panel listing
every `localStorage` key by name and what it is for.

Declining does not merely record a preference — it **deletes what is already
stored**, immediately. The choice can be changed from the *Cookie settings*
button in the footer of every page, which shows the current state.

There is no analytics, no advertising pixel and no third-party script on this
site, so those categories are not offered. Offering a switch for something that
was never on is theatre.

---

## Smooth scrolling

Lenis, on at desktop and **off on tablet and phone** — both asked for, and both
right: touch devices already have momentum scrolling that feels better than a
JavaScript reimplementation, and hijacking it costs battery and breaks the
address-bar collapse that gives a phone its extra viewport height.

The gate is `min-width: 1024px` **and** `pointer: fine` **and** not
`prefers-reduced-motion`, so a tablet with a trackpad is treated as the desktop it
is behaving like. It stops whenever a menu, calendar or lightbox is open, through
one piece of shared state in `UIProvider`.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 strict, with
`noUncheckedIndexedAccess` · Tailwind CSS v4 · Zod · Lenis · `next/font`
(self-hosted, no font CDN) · deployed on Vercel.

Five typefaces, loaded per direction rather than globally, so a visitor who only
opens Amber never downloads Instrument Serif or Lora. All five are SIL Open Font
License.

---

## Layout of the repo

```
src/
  app/
    layout.tsx              providers, switcher, business structured data
    not-found.tsx           the 404, and the three doors
    [template]/             one dynamic segment serves all three previews
      layout.tsx            data-tpl + the font class, header, footer
      page.tsx              home
      about, houses, houses/[house], experiences, experiences/[experience],
      gallery, review, contact, term-condition, privacy, terms-of-use
  components/
    blocks/                 page sections; branch on template where the
                            structure genuinely differs
    chrome/                 Header, Footer, Logo — three compositions each
    form/                   Listbox, DateField, BookingForm
    shared/                 Transition, SmoothScroll, Photo, cookie settings
    ui/                     template-aware primitives
  content/
    site.ts                 EVERY fact, from the current site
    legal.ts                privacy policy + terms of use
    photos.json             the 108 photographs, with captions
  lib/                      tokens-free helpers: format, seo, whatsapp, wait
scripts/                    crawl, fetch, optimise, audit, contrast, flow, shoot
```

---

## Known and deliberate

- **`robots.ts` disallows the whole host and the layout sends `noindex`.** Three
  previews carrying Swarma Villas' own copy would compete with
  swarmavillasbali.com in search — the textbook way to damage the client you are
  pitching to. Both come off together on the day one direction goes live under
  the real domain.
- **The supplied logo reads "Swarna Villas Ubud - Bali"** while the business is
  "Swarma Villas Bali", and the mark on the current site is orange rather than
  gold. The supplied file is used as given; the discrepancy is the client's to
  resolve.
- **`sitemap.ts` lists all 51 pages** even though nothing is crawlable today, so
  the map is already correct when the disallow comes off.
