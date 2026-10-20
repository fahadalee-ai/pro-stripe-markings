import { images } from "./images";

/**
 * All user-facing copy lives here so it can be edited without touching screens.
 * Source: https://prostripemarkings.com/ (homepage, What We Do, Our Products, Terms).
 * Items marked placeholder were not published on the website.
 */

export const business = {
  name: "PRO STRIPE MARKINGS",
  legalName: "PRO STRIPE MARKINGS L.L.C.",
  tagline: "Professional Striping, Done Right Every Time.",
  website: "https://prostripemarkings.com/",
  termsUrl: "https://prostripemarkings.com/terms-and-conditions/",
  address: "649 Monmouth Ave, Kenilworth, NJ 07033",
  street: "649 Monmouth Ave",
  city: "Kenilworth, NJ 07033",
  phoneDisplay: "(908) 591-5792",
  phoneTel: "9085915792",
  email: "prostripemarkings@gmail.com",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=649%20Monmouth%20Ave%20Kenilworth%20NJ%2007033",
  serviceArea: "Proudly serving clients across the entire state of New Jersey.",
  summary:
    "PRO STRIPE MARKINGS L.L.C. is a trusted pavement marking company based in Kenilworth, New Jersey, proudly serving clients across the entire state. We specialize in parking lot line striping, re-striping, warehouse line painting, wheel stops, traffic signs, seal coating, pothole repair, and street name signs.",
  story:
    "With years of hands-on experience, our team has earned a reputation for precision, professionalism, and reliable service. Every project we take on, whether it’s a small parking lot or a large commercial warehouse, is handled with the same attention to detail and commitment to excellence.",
  servicesIntro:
    "Explore our expert services designed to enhance safety, organization, and curb appeal. With precision and reliability, we deliver long-lasting pavement solutions that make your property stand out.",
  productsIntro:
    "Discover our reliable pavement products designed to improve safety, organization, and appearance. From signage to wheel stops, we provide durable solutions that keep your property functional, professional, and long-lasting.",
  contactIntro:
    "Ready to get started? We’d love to hear from you. Request a free estimate or reach out directly. Whether you have questions or need expert advice on your next paving project, our team is here to assist you every step of the way.",
  hoursPublished: false,
  hoursNote:
    "Business hours are not listed on prostripemarkings.com. Call or email and the crew will confirm a visit.",
  social: [] as { label: string; href: string }[],
};

export type ServiceCategory = "striping" | "signs" | "wheel-stops" | "bollards" | "pavement";

export type Service = {
  id: string;
  name: string;
  short: string;
  description: string;
  included: string[];
  idealFor: string[];
  category: ServiceCategory;
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    id: "line-striping",
    name: "Line Striping",
    short: "Sharp, durable lines that organize parking lots and roadways.",
    description:
      "Our professional line striping service creates crisp, durable markings that keep parking lots and roadways safe and organized. Using quality materials and precise techniques, we deliver long-lasting results that enhance visibility, improve traffic flow, and create a professional, polished appearance for businesses, warehouses, and commercial properties across New Jersey.",
    included: [
      "New stall, aisle, and traffic layouts",
      "Crisp, durable markings with quality materials",
      "Layouts that improve visibility and traffic flow",
      "A polished finish for commercial properties",
    ],
    idealFor: ["Parking Lots", "Warehouses", "Retail", "Industrial"],
    category: "striping",
    image: images.lineStriping,
    imageAlt: "Fresh white and yellow lines on a commercial parking lot",
  },
  {
    id: "re-striping",
    name: "Re-Striping",
    short: "Refresh faded lines and restore a sharp, professional look.",
    description:
      "Over time, markings fade and lose clarity, reducing safety and organization. Our expert re-striping service refreshes and restores lines, giving your property a sharp, professional look once again. We ensure accuracy, durability, and consistency, making your parking areas, warehouses, or roadways safer, easier to navigate, and more visually appealing.",
    included: [
      "Refresh of faded stall and aisle lines",
      "Consistent layout matched to your lot",
      "Durable markings that restore clarity",
      "A cleaner, more professional appearance",
    ],
    idealFor: ["Parking Lots", "Retail", "Warehouses", "Office"],
    category: "striping",
    image: images.restriping,
    imageAlt: "Parking lot with faded lines beside freshly re-striped stalls",
  },
  {
    id: "warehouse",
    name: "Warehouse Line Painting",
    short: "Clear floor markings for walkways, storage zones, and equipment.",
    description:
      "Clear, durable floor markings are essential for efficiency and safety in warehouses. Our warehouse line painting provides accurate markings for walkways, storage zones, and equipment areas. We help improve organization, minimize hazards, and create a smooth workflow that supports productivity and compliance in industrial spaces.",
    included: [
      "Walkway and aisle markings",
      "Storage zone and equipment areas",
      "Durable floor paint for industrial use",
      "Layouts that support safer daily operations",
    ],
    idealFor: ["Warehouses", "Industrial", "Distribution"],
    category: "striping",
    image: images.warehouse,
    imageAlt: "Warehouse floor with yellow safety aisle lines",
  },
  {
    id: "traffic-signs",
    name: "Traffic Signs",
    short: "High-quality signs for visibility, compliance, and guidance.",
    description:
      "Proper signage is critical for traffic safety and compliance. We supply and install high-quality traffic signs built for durability and visibility. From directional to regulatory signs, our solutions guide drivers and pedestrians clearly. Every sign is installed professionally to meet safety standards and withstand daily conditions.",
    included: [
      "Directional and regulatory signs",
      "Supply and professional installation",
      "Hardware built for visibility and durability",
      "Placement that supports safe navigation",
    ],
    idealFor: ["Parking Lots", "Retail", "Industrial", "Municipal"],
    category: "signs",
    image: images.trafficSigns,
    imageAlt: "Traffic signs posted at a commercial driveway",
  },
  {
    id: "street-signs",
    name: "Street Name Signs",
    short: "Custom signs that stay readable and help people navigate.",
    description:
      "Our street name sign installation provides direction, identity, and navigation for communities. We design, supply, and install clear, durable signs that are built to last. With professional-quality materials and precise installation, signs remain visible and reliable for drivers, pedestrians, and visitors.",
    included: [
      "Custom street name signs",
      "Materials chosen for visibility and durability",
      "Supply and precise installation",
      "Clear wayfinding for campuses and communities",
    ],
    idealFor: ["Municipal", "Office", "HOA/Residential", "Retail"],
    category: "signs",
    image: images.streetSigns,
    imageAlt: "Street name sign blade on a post at a paved intersection",
  },
  {
    id: "wheel-stops",
    name: "Wheel Stops",
    short: "Protect vehicles, curbs, and structures with precise placement.",
    description:
      "Wheel stops are an effective way to protect vehicles, curbs, and structures. We provide expert installation of durable wheel stops designed for safety and convenience. Installation is done with precision, ensuring proper placement and reliability, so property owners can reduce accidents, prevent damage, and improve parking lot organization.",
    included: [
      "Durable wheel stops",
      "Precise placement at stall heads",
      "Protection for vehicles, curbs, and structures",
      "A more organized parking layout",
    ],
    idealFor: ["Parking Lots", "Retail", "Office", "HOA/Residential"],
    category: "wheel-stops",
    image: images.wheelStops,
    imageAlt: "Concrete wheel stops at the head of painted parking stalls",
  },
  {
    id: "bollards",
    name: "Bollards",
    short: "Durable protection for vehicles, curbs, and property structures.",
    description:
      "On our products list, wheel stops and bollards are grouped as durable protection for vehicles, curbs, and property structures. We install bollards where cars, carts, and equipment meet buildings, walkways, and equipment areas — placed with the same precision we bring to every parking layout.",
    included: [
      "Safety bollards for entrances and walkways",
      "Placement that protects structures and curbs",
      "A clean, professional finished look",
      "Coordination with your stall layout",
    ],
    idealFor: ["Retail", "Warehouses", "Industrial", "Office"],
    category: "bollards",
    image: images.bollards,
    imageAlt: "Yellow safety bollards along a commercial entrance",
  },
  {
    id: "seal-coating",
    name: "Seal Coating",
    short: "Protect asphalt from sun, water, and traffic — and refresh the look.",
    description:
      "Seal coating is one of the best ways to protect pavement. Our service safeguards asphalt from sun, water, and traffic damage, extending its life while improving appearance. With a smooth, clean finish, your property looks more inviting and remains durable against harsh weather and heavy use.",
    included: [
      "Protective seal coat for asphalt",
      "Defense against sun, water, and traffic",
      "A smooth, even finished appearance",
      "Work that helps the pavement last longer",
    ],
    idealFor: ["Parking Lots", "Retail", "Office", "HOA/Residential"],
    category: "pavement",
    image: images.sealCoating,
    imageAlt: "Freshly seal-coated commercial parking lot",
  },
  {
    id: "pothole-repair",
    name: "Pothole Repair",
    short: "Restore a smoother, safer surface before damage spreads.",
    description:
      "Damaged pavement looks unappealing and creates safety risks. Our pothole repair restores smooth, even surfaces that are safer and longer lasting. Using proven repair techniques, we fix cracks and holes quickly and effectively, preventing further deterioration so the property stays functional, safe, and professional.",
    included: [
      "Repair of potholes and damaged areas",
      "Work aimed at a smooth, even surface",
      "Fixes that help stop further deterioration",
      "A safer lot for drivers and pedestrians",
    ],
    idealFor: ["Parking Lots", "Industrial", "Municipal", "Retail"],
    category: "pavement",
    image: images.pothole,
    imageAlt: "Repaired asphalt patch beside intact parking lines",
  },
];

export const serviceFilters: { id: "all" | ServiceCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "striping", label: "Striping" },
  { id: "signs", label: "Signs" },
  { id: "wheel-stops", label: "Wheel Stops" },
  { id: "bollards", label: "Bollards" },
  { id: "pavement", label: "Pavement" },
];

export function serviceById(id: string) {
  return services.find((service) => service.id === id);
}

export const propertyTypes = [
  "Retail",
  "Warehouse",
  "Office",
  "Industrial",
  "HOA/Residential",
  "Municipal",
] as const;

export const timeSlots = [
  "8:00–10:00 AM",
  "10:00 AM–12:00 PM",
  "12:00–2:00 PM",
  "2:00–4:00 PM",
] as const;

export const addressSuggestions = [
  "649 Monmouth Ave, Kenilworth, NJ 07033",
  "120 Market Street, Cranford, NJ 07016",
  "88 Commerce Drive, Union, NJ 07083",
  "410 Raritan Center Parkway, Edison, NJ 08837",
  "25 Industrial Road, Elizabeth, NJ 07201",
  "700 Morris Avenue, Springfield, NJ 07081",
];

export const whyUs = [
  {
    title: "Precision",
    body: "Every project, from a small parking lot to a large commercial warehouse, gets the same attention to detail.",
  },
  {
    title: "Premium materials",
    body: "Quality materials and precise techniques produce long-lasting lines, signs, and pavement protection.",
  },
  {
    title: "On time",
    body: "Clients tell us the crew shows up on time — including urgent re-striping before a big event.",
  },
  {
    title: "Statewide",
    body: "Based in Kenilworth and proudly serving property owners and paving companies across New Jersey.",
  },
];

export const testimonials = [
  {
    quote:
      "PRO STRIPE MARKINGS did an amazing job on our office parking lot. The lines are sharp and bright, and the crew was professional from start to finish. Highly recommended.",
    role: "Office property client",
  },
  {
    quote:
      "Our warehouse floor markings were fading and causing confusion. The team came in, worked quickly, and gave us clear, durable lines. It has made a huge difference in daily operations.",
    role: "Warehouse client",
  },
  {
    quote:
      "I called them for an urgent re-striping project before a big event. They showed up on time, did a fantastic job, and saved us from a lot of stress.",
    role: "Re-striping client",
  },
  {
    quote:
      "The pothole repair and seal coating they completed at our property look great. The lot is safer, smoother, and much more appealing now. Very happy with their service.",
    role: "Property maintenance client",
  },
  {
    quote:
      "From the first call to the final touches, PRO STRIPE MARKINGS exceeded expectations. They were polite, efficient, and the results speak for themselves. We will definitely use them again.",
    role: "Returning client",
  },
];

export const gallery = [
  {
    id: "g1",
    src: images.gallery1,
    alt: "Commercial parking lot with worn lines beside a freshly striped section",
    caption: "Parking lot striping",
    category: "Lots",
  },
  {
    id: "g2",
    src: images.gallery2,
    alt: "Warehouse floor with yellow aisle and zone markings",
    caption: "Warehouse floor lines",
    category: "Warehouse",
  },
  {
    id: "g3",
    src: images.gallery3,
    alt: "Accessible parking stalls with blue and white markings",
    caption: "ADA stalls",
    category: "ADA",
  },
  {
    id: "g4",
    src: images.gallery4,
    alt: "Fire lane markings along a commercial building",
    caption: "Fire lane marking",
    category: "Fire Lane",
  },
  {
    id: "g5",
    src: images.gallery5,
    alt: "Freshly painted crosswalk at a commercial driveway",
    caption: "Crosswalk",
    category: "Crosswalk",
  },
  {
    id: "g6",
    src: images.gallery6,
    alt: "White directional arrows painted on a parking aisle",
    caption: "Directional arrows",
    category: "Arrows",
  },
];

export const onboarding = [
  {
    image: images.onboarding1,
    alt: "Aerial view of a freshly striped commercial parking lot at golden hour",
    title: "Parking Lot Striping Done Right",
    body: "New layouts and re-striping with crisp, durable lines that keep your property safe, organized, and professional.",
  },
  {
    image: images.onboarding2,
    alt: "Traffic signs, yellow bollards, and wheel stops at a property entrance",
    title: "Signs, Wheel Stops & Bollards",
    body: "Complete traffic control — signs, wheel stops, and bollards installed with premium materials and a precise crew.",
  },
  {
    image: images.onboarding3,
    alt: "A property manager and contractor reviewing a parking lot layout",
    title: "Book Your Appointment in Minutes",
    body: "Choose a service, pick a date, and get a confirmed visit for your property — no phone tag.",
  },
];

/** Placeholder — prostripemarkings.com does not publish an FAQ. */
export const faqs = [
  {
    q: "Where do you work?",
    a: "We are based in Kenilworth and proudly serve clients across the entire state of New Jersey.",
    placeholder: false,
  },
  {
    q: "How do I request an estimate?",
    a: "Call (908) 591-5792, email prostripemarkings@gmail.com, or send a quote request in this app. The website invites you to request a free estimate.",
    placeholder: false,
  },
  {
    q: "Can you work around an open business?",
    a: "Placeholder: the website does not describe phasing for occupied lots. Tell us your hours in the booking notes and the crew will confirm a plan.",
    placeholder: true,
  },
  {
    q: "How soon can you schedule?",
    a: "Placeholder: lead times are not published. Book a date in the app, or choose Flexible on date and we will confirm a window with you.",
    placeholder: true,
  },
];

export const termsSummary = [
  "PRO STRIPE MARKINGS L.L.C. offers pavement marking, line striping, seal coating, pothole repair, signage, and related services across New Jersey.",
  "Services are performed with professional care. Outcomes may vary depending on property conditions, weather, and materials.",
  "The full terms are published at prostripemarkings.com/terms-and-conditions/.",
];

/** Placeholder — a standalone privacy policy was not found on the website. */
export const privacySummary = [
  "This app stores your profile, properties, and appointment requests on this device so you can book and review visits.",
  "Contact details you submit are used to confirm scheduling with Pro Stripe Markings.",
  "A separate privacy policy was not published on prostripemarkings.com. Questions: prostripemarkings@gmail.com or (908) 591-5792.",
];

export const demoAccount = {
  email: "jordan.ellis@harborretail.com",
  password: "Stripe123",
};
