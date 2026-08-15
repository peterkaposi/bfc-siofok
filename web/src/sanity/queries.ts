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
