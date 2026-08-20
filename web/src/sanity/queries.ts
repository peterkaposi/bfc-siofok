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

export const NEWS_ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "newsArticle" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    mainImage,
    body
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

export const CLUB_LEADERS_QUERY = defineQuery(`
  *[_type == "clubLeader"] | order(order asc, name asc){
    _id,
    name,
    title,
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
