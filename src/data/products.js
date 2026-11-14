/**
 * The catalogue, read as an almanac.
 *
 * Every category is a phase of the same night, so the collection is not a
 * filter list — it is a moon you can turn. Prices are in rupees.
 */

export const CATEGORIES = ["Rings", "Earrings", "Necklaces", "Bracelets", "Anklets"];

/** Horizontal offset used to draw each category's moon phase. */
export const PHASE_SHIFT = {
  Rings: "0%",
  Earrings: "-60%",
  Necklaces: "-100%",
  Bracelets: "60%",
  Anklets: "110%",
};

const detail = (sizes) => ({
  material: "925 sterling silver, recycled",
  finish: "Hand-polished, brushed interior",
  sizes,
  care: "Keep away from perfume and chlorine. Restore shine with the cloth included.",
});

export const PRODUCTS = [
  {
    slug: "selene-band",
    name: "Selene Band",
    category: "Rings",
    price: 2499,
    art: { kind: "band", rx: 30, ry: 33, weight: 7, gem: "round" },
    tagline: "A plain band, lit from one side.",
    description:
      "The first piece we ever made, and still the one we wear most. A single sweep of silver with a low-set moonstone, shaped to sit flush against the finger and catch light only when you move.",
    story: "Cast in a workshop that has been quiet since 1974, then polished until the seam disappeared.",
    details: detail("6 – 12, half sizes on request"),
  },
  {
    slug: "lunar-stack",
    name: "Lunar Stack",
    category: "Rings",
    price: 3299,
    art: { kind: "stack", rx: 30, ry: 32, weight: 4 },
    tagline: "Three thin bands, worn as one.",
    description:
      "Three rings drawn from a single wire, each a little wider than the last, soldered at a single point so they move together. Worn alone it reads as one band; up close it is three.",
    story: "Built to be stacked with anything, including itself.",
    details: detail("6 – 12"),
  },
  {
    slug: "dew-signet",
    name: "Dew Signet",
    category: "Rings",
    price: 2899,
    art: { kind: "signet", rx: 29, ry: 33, weight: 8 },
    tagline: "A flat face, waiting for a letter.",
    description:
      "A signet with a soft oval face, left blank on purpose. We can engrave it with a single initial; until then it stays a small, bright mirror.",
    story: "Blank faces are the oldest kind of personal.",
    details: detail("6 – 12"),
  },
  {
    slug: "orbit-twist",
    name: "Orbit Twist",
    category: "Rings",
    price: 2199,
    art: { kind: "twist", rx: 30, ry: 33, weight: 5 },
    tagline: "Two strands, circling.",
    description:
      "Two strands of silver twisted together and left slightly apart at the crown, so a sliver of skin shows through. It reads as movement without moving.",
    story: "The twist is set by hand, so no two sit identically.",
    details: detail("6 – 12"),
  },

  {
    slug: "crescent-drops",
    name: "Crescent Drops",
    category: "Earrings",
    price: 1899,
    art: { kind: "drop", size: 26, weight: 3, motif: "crescent" },
    tagline: "The moon, mid-wane.",
    description:
      "A thin crescent suspended from a curved hook, weighted so it hangs slightly forward and catches the eye before the earring does.",
    story: "The arc was traced from a photograph of the moon over Pune, then simplified eleven times.",
    details: detail("Drop 34mm"),
  },
  {
    slug: "pearl-hoops",
    name: "Pearl Hoops",
    category: "Earrings",
    price: 2299,
    art: { kind: "hoop", size: 28, weight: 4, pearls: 5 },
    tagline: "A hoop with five small moons.",
    description:
      "A silver hoop threaded with five freshwater pearls, spaced unevenly on purpose. The irregular rhythm is what keeps it from looking manufactured.",
    story: "Pearls sit where they fall; we only decide the count.",
    details: detail("Hoop 22mm"),
  },
  {
    slug: "stellar-studs",
    name: "Stellar Studs",
    category: "Earrings",
    price: 1299,
    art: { kind: "stud", size: 16, weight: 2, points: 6 },
    tagline: "Six points, barely there.",
    description:
      "A small six-point star, domed just enough to hold a highlight. The kind of piece you put in and forget about for a month.",
    story: "Our most-gifted piece, and the smallest thing we make.",
    details: detail("8mm"),
  },
  {
    slug: "willow-danglers",
    name: "Willow Danglers",
    category: "Earrings",
    price: 2099,
    art: { kind: "dangler", size: 34, weight: 2 },
    tagline: "Long, light, a little unruly.",
    description:
      "Three links that taper as they fall, ending in a teardrop. Light enough to swing when you turn your head, heavy enough to hang straight.",
    story: "Named for the tree behind the workshop.",
    details: detail("Drop 48mm"),
  },

  {
    slug: "half-moon-pendant",
    name: "Half Moon Pendant",
    category: "Necklaces",
    price: 3499,
    art: { kind: "pendant", size: 26, weight: 3, motif: "halfmoon" },
    tagline: "Cut in half, worn whole.",
    description:
      "A half-disc of silver on a fine chain, the flat edge brushed and the curve polished. It sits just below the collarbone and turns as you breathe.",
    story: "The flat edge is the part you feel against your skin.",
    details: detail("42 + 5cm adjustable"),
  },
  {
    slug: "thread-of-light",
    name: "Thread of Light",
    category: "Necklaces",
    price: 2799,
    art: { kind: "thread", size: 40, weight: 2 },
    tagline: "A line that keeps its own light.",
    description:
      "A single fine chain with a hand-set line of pavé down one short bar. From a distance it is a thread; up close it is a small constellation.",
    story: "The stones are set by one person, in one sitting.",
    details: detail("40 + 6cm adjustable"),
  },
  {
    slug: "halo-chain",
    name: "Halo Chain",
    category: "Necklaces",
    price: 3999,
    art: { kind: "halo", size: 32, weight: 3 },
    tagline: "A ring, hung.",
    description:
      "An open circle suspended from two points so it stays perfectly level. Worn over a shirt or against skin, it does the same quiet thing.",
    story: "Two attachment points, measured until it hung straight.",
    details: detail("45 + 5cm adjustable"),
  },
  {
    slug: "mira-choker",
    name: "Mira Choker",
    category: "Necklaces",
    price: 2599,
    art: { kind: "choker", size: 44, weight: 3 },
    tagline: "Close to the throat.",
    description:
      "A flat choker with a single bezel-set stone at the centre front. It sits high and stays there, which is the whole point of a choker.",
    story: "The clasp is hidden inside the weave.",
    details: detail("36 – 40cm"),
  },

  {
    slug: "gibbous-cuff",
    name: "Gibbous Cuff",
    category: "Bracelets",
    price: 3199,
    art: { kind: "cuff", rx: 36, ry: 22, weight: 9 },
    tagline: "Open, so it can be worn.",
    description:
      "A wide cuff, open at one side and hammered across the face so the surface never quite repeats. It holds its shape on the wrist without a clasp.",
    story: "Hammered by hand; the marks are deliberate.",
    details: detail("Adjustable, 15 – 18cm"),
  },
  {
    slug: "silver-tide",
    name: "Silver Tide",
    category: "Bracelets",
    price: 2699,
    art: { kind: "tide", rx: 34, ry: 20, weight: 4 },
    tagline: "Three waves, one line.",
    description:
      "A chain that rises and falls in three soft waves, so it moves like water on the wrist rather than hanging flat.",
    story: "The pattern came from the tide line at Alibaug.",
    details: detail("17 + 2cm adjustable"),
  },
  {
    slug: "link-whisper",
    name: "Link Whisper",
    category: "Bracelets",
    price: 2999,
    art: { kind: "links", rx: 34, ry: 20, weight: 3, count: 9 },
    tagline: "Small links, close together.",
    description:
      "Nine hand-formed links, each closed and filed individually. Close together they read as a solid band; apart, as a chain.",
    story: "Nine links, forty minutes each.",
    details: detail("18cm"),
  },
  {
    slug: "dawn-bangle",
    name: "Dawn Bangle",
    category: "Bracelets",
    price: 3599,
    art: { kind: "bangle", rx: 34, ry: 34, weight: 6 },
    tagline: "A circle with a warm interior.",
    description:
      "A solid bangle, rounded on the outside and gold-washed on the inside face only. You see it when you take it off.",
    story: "The inside is the private side.",
    details: detail("Interior 60mm"),
  },

  {
    slug: "moonwalk-chain",
    name: "Moonwalk Chain",
    category: "Anklets",
    price: 1799,
    art: { kind: "chain", size: 40, weight: 2 },
    tagline: "Barely there, always there.",
    description:
      "A fine flat chain that sits low on the ankle and disappears under a shoe. Made to be forgotten and then noticed.",
    story: "Our lightest piece at 3 grams.",
    details: detail("23 + 3cm adjustable"),
  },
  {
    slug: "little-stars",
    name: "Little Stars",
    category: "Anklets",
    price: 1999,
    art: { kind: "stars", size: 40, weight: 2, count: 7 },
    tagline: "Seven points of light.",
    description:
      "Seven small stars spaced along a fine chain, each one turned a little differently so they never line up perfectly.",
    story: "Counted seven times before it was finished.",
    details: detail("24 + 3cm adjustable"),
  },
  {
    slug: "shore-anklet",
    name: "Shore Anklet",
    category: "Anklets",
    price: 1699,
    art: { kind: "shore", size: 40, weight: 2, beads: 6 },
    tagline: "Sand, kept.",
    description:
      "A chain scattered with six small, irregular silver beads, each one a slightly different size. It sounds faintly when you walk.",
    story: "The beads are cast from grains of sand.",
    details: detail("23 + 3cm adjustable"),
  },
  {
    slug: "drift-strand",
    name: "Drift Strand",
    category: "Anklets",
    price: 2199,
    art: { kind: "drift", size: 40, weight: 2 },
    tagline: "Two strands, drifting apart.",
    description:
      "Two chains of different weight, joined at the clasp and again at the charm, so they drift apart and back together as you move.",
    story: "The gap between the strands is the design.",
    details: detail("24 + 3cm adjustable"),
  },
];

export const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);

export const byCategory = (category) => PRODUCTS.filter((p) => p.category === category);

export const related = (product, count = 4) =>
  PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug)
    .concat(PRODUCTS.filter((p) => p.category !== product.category))
    .slice(0, count);

export const formatPrice = (n) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
