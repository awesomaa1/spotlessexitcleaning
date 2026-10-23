export const PHONE_DISPLAY = "+61413 034 344"
export const PHONE_HREF = "tel:+61413034344"

export const assets = {
  heroPhoto: "/assets/ac95f.png",
  reviewerBlair: "/assets/db95c.png",
  star: "/assets/0f64e.svg",
  logoWordmark: "/assets/a106b.svg",
  logoRule: "/assets/52b75.svg",
  phoneIcon: "/assets/86f3b.svg",
  arrowIcon: "/assets/25b86.svg",
}

export type ServiceId = "house" | "airbnb" | "linen" | "lease"

export type Service = {
  id: ServiceId
  index: string
  name: string
  audience: string
  summary: string
  includes: string[]
  image: string
  imageAlt: string
}

export const services: Service[] = [
  {
    id: "house",
    index: "01",
    name: "House Cleaning",
    audience: "For homeowners",
    summary:
      "Regular or one-off cleans that keep kitchens, bathrooms and living spaces consistently calm and cared for.",
    includes: [
      "Weekly, fortnightly or one-off",
      "Kitchens & bathrooms",
      "Floors, surfaces & dusting",
    ],
    image: "/images/house-kitchen.jpg",
    imageAlt:
      "A sunlit kitchen with a timber island, open shelving and tiled splashback",
  },
  {
    id: "airbnb",
    index: "02",
    name: "Airbnb Cleaning",
    audience: "For hosts & property managers",
    summary:
      "Guest-ready turnovers between stays, with fresh linen, restocked essentials and every room reset to standard.",
    includes: [
      "Turnovers between guests",
      "Linen change & restocking",
      "Presentation checks",
    ],
    image: "/images/airbnb-bedroom.jpg",
    imageAlt:
      "A freshly made bed with white linen beside a timber bedside table",
  },
  {
    id: "linen",
    index: "03",
    name: "Linen & Fabric Care",
    audience: "For homes & short stays",
    summary:
      "Specialised washing, pressing and folding for bed linen, towels and soft furnishings that deserve proper care.",
    includes: [
      "Bed linen & towels",
      "Pressed and folded",
      "Curtains & soft furnishings",
    ],
    image: "/images/linen-shelf.jpg",
    imageAlt: "Neatly folded linen tea towels stacked on a timber shelf",
  },
  {
    id: "lease",
    index: "04",
    name: "End-of-Lease Cleaning",
    audience: "For tenants & landlords",
    summary:
      "A thorough, detailed clean that prepares the property for inspection and hands it back in excellent condition.",
    includes: [
      "Inspection-ready detailing",
      "Inside cupboards & appliances",
      "Windows, skirting & tracks",
    ],
    image: "/images/end-of-lease-room.jpg",
    imageAlt:
      "An empty, bright room with polished timber floors and tall windows",
  },
]

export type Review = {
  quote: string
  name: string
  location: string
  avatar: string
  rating: number
}

/* Only client-supplied reviews belong here (this one is sourced from the hero design). */
export const reviews: Review[] = [
  {
    quote:
      "I could cry with relief at finally finding people good at their job. It all looks fantastic and I'm so thrilled with the quality.",
    name: "Blair Purvis",
    location: "Melbourne",
    avatar: assets.reviewerBlair,
    rating: 5,
  },
  {
    quote:
      "Every corner was immaculate. Spotless has been our trusted team for our Airbnb turnovers—flawless service and attention to detail every single time.",
    name: "Marcus & Elena Vance",
    location: "South Yarra, Melbourne",
    avatar: assets.reviewerBlair,
    rating: 5,
  },
]

/** Primary navigation, in page order. Each href targets a section id. */
export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Quote", href: "#quote" },
  { label: "Reviews", href: "#reviews" },
]

export const sectionIds = navLinks.map((l) => l.href.slice(1))
