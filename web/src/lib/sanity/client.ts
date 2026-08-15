import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { client, isSanityConfigured } from "@/sanity/client";
import {
  CLUB_HISTORY_QUERY,
  NEWS_ARTICLE_BY_SLUG_QUERY,
  NEWS_ARTICLES_QUERY,
  PLAYERS_QUERY,
  SPONSORS_QUERY,
  UPCOMING_EVENTS_QUERY,
} from "@/sanity/queries";

export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface NewsArticleDetail extends NewsArticle {
  body?: PortableTextBlock[];
}

export interface ClubEvent {
  _id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
}

export interface Player {
  _id: string;
  name: string;
  position?: string;
  number?: number;
  photoUrl?: string;
}

export interface ClubHistory {
  _id: string;
  title: string;
  body: PortableTextBlock[];
}

export interface Sponsor {
  _id: string;
  name: string;
  logoUrl?: string;
  url?: string;
}

interface PortableTextSpan {
  _type: "span";
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type: "block";
  style?: string;
  children?: PortableTextSpan[];
}

const builder = createImageUrlBuilder(client);

function buildImageUrl(source: SanityImageSource | undefined): string | undefined {
  if (!source) return undefined;
  return builder.image(source).width(800).height(450).fit("crop").url();
}

function buildLogoUrl(source: SanityImageSource | undefined): string | undefined {
  if (!source) return undefined;
  return builder.image(source).width(240).height(120).fit("max").url();
}

export const PLACEHOLDER_NEWS: NewsArticle[] = [
  {
    _id: "placeholder-1",
    title: "Üdv a BFC Siófok oldalán!",
    slug: "udv-a-bfc-siofok-oldalan",
    excerpt:
      "A hírek hamarosan a Sanity CMS-ből érkeznek. Addig is kövess minket a közösségi médiában!",
    category: "Hírek",
    publishedAt: new Date().toISOString(),
  },
  {
    _id: "placeholder-2",
    title: "Labdarúgás szenvedély a Balaton partján",
    slug: "piros-fekete-szenvedely",
    excerpt: "Minden mérkőzés, minden hír — egy helyen.",
    category: "Klub",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function buildHeroImageUrl(
  source: SanityImageSource | undefined,
): string | undefined {
  if (!source) return undefined;
  return builder.image(source).width(1200).height(675).fit("crop").url();
}

export async function getNewsArticles(limit = 6): Promise<NewsArticle[]> {
  if (!isSanityConfigured) return PLACEHOLDER_NEWS.slice(0, limit);

  try {
    const articles = await client.fetch<
      Array<{
        _id: string;
        title: string;
        slug: { current: string };
        excerpt?: string;
        category?: string;
        publishedAt: string;
        mainImage?: SanityImageSource;
      }>
    >(NEWS_ARTICLES_QUERY, { limit }, { next: { revalidate: 60 } });

    if (!articles.length) return PLACEHOLDER_NEWS.slice(0, limit);

    return articles.map((article) => ({
      _id: article._id,
      title: article.title,
      slug: article.slug.current,
      excerpt: article.excerpt,
      category: article.category,
      publishedAt: article.publishedAt,
      imageUrl: buildImageUrl(article.mainImage),
    }));
  } catch {
    return PLACEHOLDER_NEWS.slice(0, limit);
  }
}

export async function getNewsArticleBySlug(
  slug: string,
): Promise<NewsArticleDetail | null> {
  if (!isSanityConfigured) return null;

  try {
    const article = await client.fetch<{
      _id: string;
      title: string;
      slug: { current: string };
      excerpt?: string;
      category?: string;
      publishedAt: string;
      mainImage?: SanityImageSource;
      body?: PortableTextBlock[];
    } | null>(NEWS_ARTICLE_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });

    if (!article) return null;

    return {
      _id: article._id,
      title: article.title,
      slug: article.slug.current,
      excerpt: article.excerpt,
      category: article.category,
      publishedAt: article.publishedAt,
      imageUrl: buildHeroImageUrl(article.mainImage),
      body: article.body,
    };
  } catch {
    return null;
  }
}

export async function getUpcomingEvents(limit = 4): Promise<ClubEvent[]> {
  if (!isSanityConfigured) return [];

  try {
    return await client.fetch<ClubEvent[]>(
      UPCOMING_EVENTS_QUERY,
      { now: new Date().toISOString(), limit },
      { next: { revalidate: 60 } },
    );
  } catch {
    return [];
  }
}

export async function getPlayers(): Promise<Player[]> {
  if (!isSanityConfigured) return [];

  try {
    const players = await client.fetch<
      Array<{
        _id: string;
        name: string;
        position?: string;
        number?: number;
        photo?: SanityImageSource;
      }>
    >(PLAYERS_QUERY, {}, { next: { revalidate: 60 } });

    return players.map((player) => ({
      _id: player._id,
      name: player.name,
      position: player.position,
      number: player.number,
      photoUrl: buildImageUrl(player.photo),
    }));
  } catch {
    return [];
  }
}

export async function getClubHistory(): Promise<ClubHistory | null> {
  if (!isSanityConfigured) return null;

  try {
    return await client.fetch<ClubHistory | null>(
      CLUB_HISTORY_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
  } catch {
    return null;
  }
}

export async function getSponsors(): Promise<Sponsor[]> {
  if (!isSanityConfigured) return [];

  try {
    const sponsors = await client.fetch<
      Array<{
        _id: string;
        name: string;
        logo?: SanityImageSource;
        url?: string;
      }>
    >(SPONSORS_QUERY, {}, { next: { revalidate: 60 } });

    return sponsors.map((sponsor) => ({
      _id: sponsor._id,
      name: sponsor.name,
      url: sponsor.url,
      logoUrl: buildLogoUrl(sponsor.logo),
    }));
  } catch {
    return [];
  }
}
