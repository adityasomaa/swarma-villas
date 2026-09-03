import { addressOneLine, business, houses, mapsPlaceUrl, publishedRating } from "@/content/site";

/**
 * The one place the production origin is written. If the Vercel alias ever has
 * to change, change it here and the canonical tags, the sitemap, robots.txt and
 * every absolute URL in the structured data follow.
 */
export const SITE_URL = "https://swarma-villas.vercel.app";

export function absolute(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/* -----------------------------------------------------------------------------
   STRUCTURED DATA
   -----------------------------------------------------------------------------
   Swarma Villas is a local business with a thin Google footprint, which is
   exactly where structured data earns its keep: it states the name, the
   address, the phone number and the three bookable units in a form Google does
   not have to infer from prose.

   Everything comes from content/site.ts. The only rating asserted is the one
   the villa publishes on its own room pages, and it is attributed.
   -------------------------------------------------------------------------- */

const BUSINESS_ID = `${SITE_URL}/#lodging`;

export function lodgingBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": BUSINESS_ID,
    name: business.name,
    alternateName: `${business.name} – ${business.tagline}`,
    description: business.positioning,
    url: SITE_URL,
    telephone: business.phoneDisplay,
    email: business.email,
    image: absolute("/img/pool-01-1600.webp"),
    hasMap: mapsPlaceUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.village,
      addressRegion: business.address.province,
      postalCode: business.address.postalCode,
      addressCountry: business.address.countryCode,
    },
    areaServed: {
      "@type": "Place",
      name: `${business.address.district}, ${business.address.regency}, ${business.address.province}`,
    },
    priceRange: `IDR ${Math.min(...houses.map((h) => h.priceFromIDR)).toLocaleString("en-US")}–${Math.max(
      ...houses.map((h) => h.priceFromIDR),
    ).toLocaleString("en-US")}`,
    numberOfRooms: houses.length,
    checkinTime: "14:00",
    checkoutTime: "12:00",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Outdoor swimming pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "On-site restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    ],
    containsPlace: houses.map((h) => ({
      "@type": "Accommodation",
      "@id": accommodationId(h.slug),
      name: h.name,
    })),
  };
}

export function accommodationId(slug: string): string {
  return `${SITE_URL}/#house-${slug}`;
}

/** Per-unit structured data, emitted on that unit's page in every preview. */
export function accommodationJsonLd(slug: string, canonicalPath: string) {
  const house = houses.find((h) => h.slug === slug);
  if (!house) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "@id": accommodationId(house.slug),
    name: house.name,
    description: house.distinction,
    url: absolute(canonicalPath),
    image: absolute(`/img/${house.photos[0]}-1600.webp`),
    containedInPlace: { "@id": BUSINESS_ID },
    occupancy: { "@type": "QuantitativeValue", maxValue: house.maxGuests, unitText: "guests" },
    floorSize: { "@type": "QuantitativeValue", value: house.sizeSqm, unitCode: "MTK" },
    bed: { "@type": "BedDetails", typeOfBed: house.bed, numberOfBeds: 1 },
    amenityFeature: house.amenities.slice(0, 12).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.village,
      addressRegion: business.address.province,
      postalCode: business.address.postalCode,
      addressCountry: business.address.countryCode,
    },
    // The published "start from" rate. No availability is asserted, because we
    // do not know it — a wrong availability claim is worse than none.
    offers: {
      "@type": "Offer",
      price: house.priceFromIDR,
      priceCurrency: "IDR",
      url: absolute(canonicalPath),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: house.priceFromIDR,
        priceCurrency: "IDR",
        unitCode: "DAY",
        unitText: "per night, from",
      },
    },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export { addressOneLine, publishedRating };
