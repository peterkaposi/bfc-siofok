import { defineQuery } from "next-sanity";

export const NEWS_ARTICLES_QUERY = defineQuery(`
  *[_type == "newsArticle"] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    mainImage
  }
`);

export const UPCOMING_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && date >= $now] | order(date asc)[0...$limit]{
    _id,
    title,
    date,
    location,
    description
  }
`);

export const PLAYERS_QUERY = defineQuery(`
  *[_type == "player"] | order(order asc, name asc){
    _id,
    name,
    position,
    number,
    photo
  }
`);

export const CLUB_HISTORY_QUERY = defineQuery(`
  *[_type == "clubHistory"][0]{
    _id,
    title,
    body
  }
`);

export const SPONSORS_QUERY = defineQuery(`
  *[_type == "sponsor"] | order(order asc, name asc){
    _id,
    name,
    logo,
    url
  }
`);
