export const CLUB = {
  name: "BFC Siófok",
  shortName: "BFC Siófok",
  slug: "bfc-siofok",
  tagline: "Piros-fekete szenvedély a Balaton partján",
  city: "Siófok",
  founded: 1921,
  stadium: "Városi Sportpálya",
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
  instagram: "",
  youtube: "",
} as const;

export const REVALIDATE_SECONDS = 300;
