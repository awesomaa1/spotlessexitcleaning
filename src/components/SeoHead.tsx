import { useEffect } from "react"

/**
 * SeoHead — injects Melbourne cleaning SEO signals into <head> at runtime.
 * Safe for Figma Make / Vite SPAs where index.html is partially managed by Figma.
 *
 * Target keywords:
 *   "cleaning company Melbourne" | "end of lease cleaning Melbourne"
 *   "Airbnb cleaning Melbourne" | "house cleaning Melbourne"
 *   "linen cleaning service Melbourne" | "bond cleaning Melbourne"
 */

const SITE_URL  = "https://spotlessexitcleaning.com.au"
const SITE_NAME = "Spotless Exit Cleaning"
const PHONE     = "+61413034344"

const TITLE =
  "Spotless Exit Cleaning Melbourne | House, Airbnb & End-of-Lease Cleaners"

const DESCRIPTION =
  "Melbourne's trusted cleaning company for house cleans, Airbnb turnovers, " +
  "end-of-lease / bond cleans and linen care. Professional, reliable and " +
  "inspection-ready results across Melbourne & surrounds. Call +61 413 034 344."

const KEYWORDS =
  "cleaning company Melbourne, cleaning services Melbourne, end of lease cleaning Melbourne, " +
  "bond cleaning Melbourne, Airbnb cleaning Melbourne, house cleaning Melbourne, " +
  "professional cleaners Melbourne, linen cleaning service Melbourne, " +
  "vacate cleaning Melbourne, domestic cleaning Melbourne, " +
  "short stay cleaning Melbourne, South Yarra cleaning, " +
  "cleaning company near me Melbourne"

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: PHONE,
  email: "hello@spotlessexitcleaning.com.au",
  priceRange: "$$",
  image: `${SITE_URL}/assets/og-image.jpg`,
  logo: `${SITE_URL}/assets/logo.svg`,
  areaServed: [
    { "@type": "City", name: "Melbourne", sameAs: "https://www.wikidata.org/wiki/Q3141" },
    { "@type": "AdministrativeArea", name: "Greater Melbourne" },
    { "@type": "Suburb", name: "South Yarra" },
    { "@type": "Suburb", name: "Fitzroy" },
    { "@type": "Suburb", name: "Richmond" },
    { "@type": "Suburb", name: "St Kilda" },
    { "@type": "Suburb", name: "Prahran" },
    { "@type": "Suburb", name: "Toorak" },
    { "@type": "Suburb", name: "Collingwood" },
    { "@type": "Suburb", name: "Carlton" },
    { "@type": "Suburb", name: "Brunswick" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressRegion: "VIC",
    postalCode: "3000",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      opens: "07:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services Melbourne",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "House Cleaning Melbourne" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airbnb & Short-Stay Cleaning Melbourne" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "End-of-Lease Bond Cleaning Melbourne" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Linen & Fabric Care Melbourne" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "47",
    bestRating: "5",
  },
  sameAs: [
    "https://www.facebook.com/spotlessexitcleaning",
    "https://www.instagram.com/spotlessexitcleaning",
  ],
}

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",        item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Services",    item: `${SITE_URL}/#services` },
    { "@type": "ListItem", position: 3, name: "Get a Quote", item: `${SITE_URL}/#quote` },
    { "@type": "ListItem", position: 4, name: "Reviews",     item: `${SITE_URL}/#reviews` },
  ],
}

// ── helpers ──────────────────────────────────────────────────────────────────

function setMeta(attrs: Record<string, string>) {
  const key =
    attrs.name     ? `meta[name="${attrs.name}"]` :
    attrs.property ? `meta[property="${attrs.property}"]` : null
  let el = key
    ? (document.head.querySelector(key) as HTMLMetaElement | null)
    : null
  if (!el) {
    el = document.createElement("meta")
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v))
}

function setLink(attrs: Record<string, string>) {
  let el = document.head.querySelector(
    `link[rel="${attrs.rel}"]`
  ) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement("link")
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v))
}

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement("script")
    el.id   = id
    el.type = "application/ld+json"
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

// ── component ─────────────────────────────────────────────────────────────────

export default function SeoHead() {
  useEffect(() => {
    // Page title
    document.title = TITLE

    // HTML lang for en-AU locale
    document.documentElement.lang = "en-AU"

    // Core meta
    setMeta({ name: "description",        content: DESCRIPTION })
    setMeta({ name: "keywords",           content: KEYWORDS })
    setMeta({ name: "robots",             content: "index, follow, max-snippet:-1, max-image-preview:large" })
    setMeta({ name: "author",             content: SITE_NAME })

    // Geo / local SEO signals
    setMeta({ name: "geo.region",         content: "AU-VIC" })
    setMeta({ name: "geo.placename",      content: "Melbourne, Victoria, Australia" })
    setMeta({ name: "geo.position",       content: "-37.8136;144.9631" })
    setMeta({ name: "ICBM",              content: "-37.8136, 144.9631" })

    // Open Graph
    setMeta({ property: "og:type",         content: "website" })
    setMeta({ property: "og:url",          content: SITE_URL })
    setMeta({ property: "og:title",        content: TITLE })
    setMeta({ property: "og:description",  content: DESCRIPTION })
    setMeta({ property: "og:image",        content: `${SITE_URL}/assets/og-image.jpg` })
    setMeta({ property: "og:image:width",  content: "1200" })
    setMeta({ property: "og:image:height", content: "630" })
    setMeta({ property: "og:image:alt",    content: "Spotless Exit Cleaning – Professional Cleaners in Melbourne, VIC" })
    setMeta({ property: "og:site_name",    content: SITE_NAME })
    setMeta({ property: "og:locale",       content: "en_AU" })

    // Twitter Card
    setMeta({ name: "twitter:card",        content: "summary_large_image" })
    setMeta({ name: "twitter:title",       content: TITLE })
    setMeta({ name: "twitter:description", content: DESCRIPTION })
    setMeta({ name: "twitter:image",       content: `${SITE_URL}/assets/og-image.jpg` })

    // Canonical URL
    setLink({ rel: "canonical", href: SITE_URL })

    // Structured data
    injectJsonLd("ld-localbusiness", LOCAL_BUSINESS_SCHEMA)
    injectJsonLd("ld-breadcrumb",    BREADCRUMB_SCHEMA)
  }, [])

  return null
}
