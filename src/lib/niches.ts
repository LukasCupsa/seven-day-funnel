// Niche landing pages are driven entirely by these config objects.
// To add a niche: add one entry to NICHES and one thin route file that renders <NichePage>.

export type NicheKey = "painting" | "renovation";

export type NicheConfig = {
  /** URL slug, also sent to GHL as page_slug and to Meta as content_name */
  slug: string;
  /** Short niche key sent to GHL hidden field "niche" */
  niche: NicheKey;
  metaTitle: string;
  metaDescription: string;
  qualifier: string;
  /** Wrap exactly ONE word in [brackets] to render it in gold */
  headline: string;
  ctaButton: string;
  formBanner: string;
  pains: readonly [string, string, string];
};

/** The ONLY proof allowed on niche pages. Do not add testimonials, stats, logos or guarantees. */
export const NICHE_PROOF_LINE =
  "One client went from no online presence to $28K in their first month. One client, not a promise.";

/** Same Wistia VSL + player settings used on /local-offer */
export const NICHE_VSL_MEDIA_ID = "vaewr1pvdm";

export const HOW_IT_WORKS = [
  {
    title: "We Film",
    body: "One day at your jobsite, shop or office. Scripted and directed. You just show up.",
  },
  {
    title: "We Edit And Post",
    body: "Short videos published across your platforms.",
  },
  {
    title: "We Run Ads",
    body: "Meta ads put them in front of homeowners in your area.",
  },
  {
    title: "You Get Booked",
    body: "Leads land as booked calls.",
  },
] as const;

export const NICHES = {
  "painting-contractors": {
    slug: "painting-contractors",
    niche: "painting",
    metaTitle: "Painting Company Marketing in Ottawa & Kingston | DTI Media",
    metaDescription:
      "How Ottawa & Kingston painting companies book more jobs without renting leads. We film, post and run ads so homeowners book calls with you.",
    qualifier: "FOR OTTAWA & KINGSTON PAINTING COMPANIES DOING $10K+/MONTH",
    headline: "HOW PAINTING COMPANIES BOOK MORE JOBS [WITHOUT] RENTING LEADS",
    ctaButton: "SEE IF MY PAINTING COMPANY QUALIFIES",
    formBanner: "ONLY FOR PAINTING COMPANIES THAT CAN HANDLE MORE JOBS",
    pains: [
      "Lead sites rent you customers who only want the cheapest quote.",
      "Your best finish work never gets seen because nobody films it.",
      "The fall rush ends and nothing is lined up behind it.",
    ],
  },
  "home-renovation": {
    slug: "home-renovation",
    niche: "renovation",
    metaTitle: "Renovation Company Marketing in Ottawa & Kingston | DTI Media",
    metaDescription:
      "How Ottawa & Kingston renovation companies book bigger projects without chasing quotes. We film, post and run ads so homeowners book calls with you.",
    qualifier: "FOR OTTAWA & KINGSTON RENOVATION COMPANIES DOING $10K+/MONTH",
    headline: "HOW RENOVATION COMPANIES BOOK BIGGER PROJECTS [WITHOUT] CHASING QUOTES",
    ctaButton: "SEE IF MY RENOVATION COMPANY QUALIFIES",
    formBanner: "ONLY FOR RENOVATION COMPANIES THAT CAN HANDLE MORE PROJECTS",
    pains: [
      "Homeowners look you up before they request a quote, and find nothing that shows your standard.",
      "Word of mouth got you here, but you can't schedule it or scale it.",
      "Quote requests from people who never saw your work waste your time.",
    ],
  },
} as const satisfies Record<string, NicheConfig>;

export type NicheSlug = keyof typeof NICHES;

export function nicheHead(config: NicheConfig) {
  return {
    meta: [
      { title: config.metaTitle },
      { name: "description", content: config.metaDescription },
      { property: "og:title", content: config.metaTitle },
      { property: "og:description", content: config.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

/** Splits "A [B] C" into parts, flagging the bracketed word for gold emphasis. */
export function splitHeadline(headline: string): { text: string; gold: boolean }[] {
  return headline
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("[") && part.endsWith("]")
        ? { text: part.slice(1, -1), gold: true }
        : { text: part, gold: false },
    );
}
