export const CLUB = {
  name: "BFC Siófok",
  shortName: "BFC Siófok",
  slug: "bfc-siofok",
  tagline: "Labdarúgás szenvedély a Balaton partján",
  headerSubtitle: "Felnőtt labdarúgó csapat hivatalos oldala",
  city: "Siófok",
  founded: 1921,
  stadium: "Révész Géza utcai stadion",
  email: "bfcsiofokkft@gmail.com",
} as const;

export const EREDMENYEK = {
  baseUrl: "https://www.eredmenyek.com",
  teamId: "YFzGWgOR",
  teamSlug: "siofok",
  teamUrl: "https://www.eredmenyek.com/csapat/siofok/YFzGWgOR/",
  standingsUrl: "https://www.eredmenyek.com/csapat/siofok/YFzGWgOR/tabella/",
  fixturesUrl:
    "https://www.eredmenyek.com/csapat/siofok/YFzGWgOR/fixtures/",
  resultsUrl: "https://www.eredmenyek.com/csapat/siofok/YFzGWgOR/results/",
  /** Primary league label fragment used to filter season stats */
  primaryLeague: "NB III",
} as const;

export const SOCIAL = {
  facebook: "https://www.facebook.com/bfcsiofok",
  instagram: "https://www.instagram.com/media_bfcsiofok/",
  tiktok: "https://www.tiktok.com/@media.bfcsiofok",
  youtube: "",
} as const;

export const REVALIDATE_SECONDS = 300;

/** Cache TTL for live match score / goal updates */
export const LIVE_REVALIDATE_SECONDS = 30;

/** Flashscore ninja feed signature for match detail requests */
export const FLASHSCORE_FEED_SIGN = "SW9D1eZo";

export const NAV_ITEMS = [
  { href: "/#meccsek", label: "Meccsek" },
  { href: "/#tabella", label: "Tabella" },
  { href: "/#hirek", label: "Hírek, események" },
  { href: "/#jatekosok", label: "Játékosok" },
  { href: "/#klubvezetes", label: "Klubvezetés" },
  { href: "/#tortenelem", label: "Klub történelem" },
] as const;

export const SHOP_LINK = {
  href: "/shop",
  label: "Webshop",
} as const;
