"use client";

import { LogoImage } from "@/components/chrome/Logo";
import { useConsent } from "@/components/shared/ConsentProvider";
import { TLink } from "@/components/shared/Transition";
import { Button, Container } from "@/components/ui";
import {
  addressOneLine,
  business,
  cta,
  experiences,
  houses,
  mapsDirectionsUrl,
  nav,
} from "@/content/site";
import { useEnquiry } from "@/lib/useEnquiry";

/* =============================================================================
   FOOTER
   -----------------------------------------------------------------------------
   A dark band using `.on-deep`, which flips the palette inside so the same
   tokens (`text-ink`, `text-muted`, `border-line`) resolve to their
   light-on-dark values and nothing below needs a "dark variant".

   The Cookie settings entry is a real button, not a link. It calls reopen() on
   the consent provider, which brings the two-level panel back with the current
   choice selected — a settings link that went to a page describing cookies
   would not be a working setting.
   ========================================================================== */

const legalLinks = [
  { label: "Terms & conditions", href: "/term-condition" },
  { label: "Terms of use", href: "/terms-of-use" },
  { label: "Privacy policy", href: "/privacy" },
];

const linkClass =
  "text-[0.9375rem] text-muted underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline";

export function Footer() {
  const { reopen, consent } = useConsent();
  const enquiry = useEnquiry();
  const year = new Date().getFullYear();

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
      <Container width="wide" className="py-16 md:py-20">
        {/* -------------------------------------------------- masthead row */}
        <div className="flex flex-col gap-8 border-b border-line pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <LogoImage tone="reversed" className="h-20 md:h-24" />
            <p className="measure-prose mt-6 text-[0.9375rem] leading-[1.7] text-muted">
              {business.founderLine}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href={cta.primary.href}>{cta.primary.label}</Button>
            <Button href={enquiry("Footer — Ask on WhatsApp")} tone="outline" external>
              {cta.secondary.label}
            </Button>
          </div>
        </div>

        {/* ---------------------------------------------------- link columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="kicker text-gold">{col.title}</h2>
              <ul className="mt-5 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <TLink href={link.href} className={linkClass}>
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
                <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <address className="not-italic">{addressOneLine}</address>
                </a>
              </li>
              <li>
                <a href={`tel:${business.phoneE164}`} className={linkClass}>
                  {business.phoneDisplay}
                </a>
                <span className="ml-2 text-[0.75rem] text-subtle">Reservations</span>
              </li>
              <li>
                <a
                  href={enquiry("Footer — WhatsApp number")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {business.whatsappDisplay}
                </a>
                <span className="ml-2 text-[0.75rem] text-subtle">WhatsApp</span>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className={linkClass}>
                  {business.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------- fine print */}
        <div className="flex flex-col gap-5 border-t border-line pt-8 text-[0.8125rem] text-muted md:flex-row md:items-center md:justify-between">
          {/* The page is static, so the server's year can trail the visitor's
              for a few hours around New Year. That is the one expected
              difference, and it is not worth a hydration error. */}
          <p suppressHydrationWarning>
            &copy; {year} {business.name}. {business.positioning}.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <TLink
                  href={link.href}
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
      </Container>
    </footer>
  );
}
