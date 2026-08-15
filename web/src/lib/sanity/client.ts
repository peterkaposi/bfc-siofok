import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { client, isSanityConfigured } from "@/sanity/client";
import { NEWS_ARTICLES_QUERY, UPCOMING_EVENTS_QUERY } from "@/sanity/queries";

export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface ClubEvent {
  _id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
}

const builder = createImageUrlBuilder(client);

function buildImageUrl(source: SanityImageSource | undefined): string | undefined {
  if (!source) return undefined;
  return builder.image(source).width(800).height(450).fit("crop").url();
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
    title: "Piros-fekete szenvedély a Balaton partján",
    slug: "piros-fekete-szenvedely",
    excerpt: "Minden mérkőzés, minden hír — egy helyen.",
    category: "Klub",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

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
