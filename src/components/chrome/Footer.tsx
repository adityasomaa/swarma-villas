"use client";

import { LogoImage } from "@/components/chrome/Logo";
import { useConsent } from "@/components/shared/ConsentProvider";
import { TLink } from "@/components/shared/Transition";
import { Container } from "@/components/ui";
import {
  addressOneLine,
  business,
  cta,
  experiences,
  houses,
  mapsDirectionsUrl,
  nav,
} from "@/content/site";
import { clsx } from "@/lib/clsx";
import { href, TEMPLATES, type TemplateId } from "@/lib/templates";
import { useEnquiry } from "@/lib/useEnquiry";

/* =============================================================================
   THE THREE FOOTERS
   -----------------------------------------------------------------------------
   All three are dark bands using `.on-deep`, which flips the palette inside so
   the same tokens (`text-ink`, `text-muted`, `border-line`) resolve to their
   light-on-dark values and no component below needs a "dark variant".

   The Cookie settings entry is a real button, not a link. It calls reopen() on
   the consent provider, which brings the two-level panel back with the current
   choice selected — the brief asked for a WORKING cookie settings feature, and
   a settings link that goes to a page describing cookies is not one.
   ========================================================================== */

const legalLinks = [
  { label: "Terms & conditions", href: "/term-condition" },
  { label: "Terms of use", href: "/terms-of-use" },
  { label: "Privacy policy", href: "/privacy" },
];

export function Footer({ tpl }: { tpl: TemplateId }) {
  const { reopen, consent } = useConsent();
  const enquiry = useEnquiry();
  const year = 2026;

  const columns = [
    { title: "Visit", links: nav.map((n) => ({ label: n.label, href: n.href })) },
    { title: "The houses", links: houses.map((h) => ({ label: h.name, href: `/houses/${h.slug}` })) },
    {
      title: "Experiences",
      links: experiences.map((e) => ({ label: e.name, href: `/experiences/${e.slug}` })),
    },
  ];

  return (
    <footer className="on-deep bg-deep">
      <Container width={tpl === "t2" ? "wide" : "default"} className="py-16 md:py-20">
        {/* -------------------------------------------------- masthead row */}
        <div
          className={clsx(
            "flex flex-col gap-8",
            tpl === "t3"
              ? "items-center border-b border-line pb-12 text-center"
              : "border-b border-line pb-12 md:flex-row md:items-end md:justify-between",
          )}
        >
          <div className={clsx(tpl === "t3" && "flex flex-col items-center")}>
            <LogoImage tone="gold" height={40} />
            <p
              className={clsx(
                "measure-prose mt-6 text-[0.9375rem] leading-[1.7] text-muted",
                tpl === "t3" && "mx-auto",
              )}
            >
              {business.founderLine}
            </p>
          </div>

          <div className={clsx("flex flex-wrap gap-3", tpl === "t3" && "justify-center")}>
            <TLink
              href={href(tpl, cta.primary.href)}
              className="inline-flex items-center justify-center bg-gold px-7 py-3.5 text-[0.9375rem] font-medium text-ongold transition-[filter] duration-300 hover:brightness-[1.06]"
              style={{ borderRadius: "var(--r-pill)" }}
            >
              {cta.primary.label}
            </TLink>
            <a
              href={enquiry("Footer — Ask on WhatsApp")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-current px-7 py-3.5 text-[0.9375rem] font-medium transition-colors duration-300 hover:bg-ink hover:text-deep"
              style={{ borderRadius: "var(--r-pill)" }}
            >
              {cta.secondary.label}
            </a>
          </div>
        </div>

        {/* ---------------------------------------------------- link columns */}
        <div
          className={clsx(
            "grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4",
            tpl === "t3" && "text-center sm:text-left",
          )}
        >
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="kicker text-gold">{col.title}</h2>
              <ul className="mt-5 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <TLink
                      href={href(tpl, link.href)}
                      className="text-[0.9375rem] text-muted underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                    >
                      {link.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="kicker text-gold">Contact</h2>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem] text-muted">
              <li>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                >
                  <address className="not-italic">{addressOneLine}</address>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${business.phoneE164}`}
                  className="underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                >
                  {business.phoneDisplay}
                </a>
                <span className="ml-2 text-[0.75rem] text-subtle">Reservations</span>
              </li>
              <li>
                <a
                  href={enquiry("Footer — WhatsApp number")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                >
                  {business.whatsappDisplay}
                </a>
                <span className="ml-2 text-[0.75rem] text-subtle">WhatsApp</span>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                >
                  {business.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------- fine print */}
        <div
          className={clsx(
            "flex flex-col gap-5 border-t border-line pt-8 text-[0.8125rem] text-muted",
            tpl === "t3" ? "items-center text-center" : "md:flex-row md:items-center md:justify-between",
          )}
        >
          <p>
            &copy; {year} {business.name}. {business.positioning}.
          </p>

          <ul className={clsx("flex flex-wrap items-center gap-x-5 gap-y-2", tpl === "t3" && "justify-center")}>
            {legalLinks.map((link) => (
              <li key={link.href}>
                <TLink
                  href={href(tpl, link.href)}
                  className="underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                >
                  {link.label}
                </TLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={reopen}
                className="underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
              >
                Cookie settings
                <span className="ml-1.5 text-subtle">
                  {consent === "accepted" ? "(on)" : consent === "declined" ? "(off)" : ""}
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* This block is review scaffolding, not part of the design. */}
        <p data-preview-chrome className="mt-8 text-[0.75rem] leading-relaxed text-subtle">
          Design preview {TEMPLATES[tpl].index} of 3 — &ldquo;{TEMPLATES[tpl].name}&rdquo;, after{" "}
          {TEMPLATES[tpl].reference.label}. A redesign proposal for swarmavillasbali.com; not the
          live site. All photography and all published facts are the villa&rsquo;s own.
        </p>
      </Container>
    </footer>
  );
}
