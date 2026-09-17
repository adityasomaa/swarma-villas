import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/PageHero";
import { Button, Container, Section } from "@/components/ui";
import { cta } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Served with a real 404 status for any address the site does not have,
 * including an invented house or experience slug. It sits inside the root
 * layout, so the header and footer are there to find a way back.
 */
export default function NotFound() {
  return (
    <>
      <PageHero
        kicker="Error 404"
        title="Nothing lives at this address"
        lede="The page may have moved, or the link may have a typo in it. Everything on the site is still reachable from here."
      />
      <Section tone="canvas" size="tight">
        <Container>
          <div className="flex flex-wrap gap-3">
            <Button href="/">Back to the home page</Button>
            <Button href="/houses" tone="outline">
              See the three houses
            </Button>
            <Button href={cta.primary.href} tone="outline">
              {cta.primary.label}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
