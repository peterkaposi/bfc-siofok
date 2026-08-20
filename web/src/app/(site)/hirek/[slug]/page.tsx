import Link from "next/link";
import { notFound } from "next/navigation";
import PortableText from "@/components/PortableText";
import { getNewsArticleBySlug } from "@/lib/sanity/client";
import { formatMatchDate } from "@/lib/utils";
import { isYoutubeThumbnailUrl } from "@/lib/youtube";

export const revalidate = 60;

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    return { title: "Hír nem található" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="overflow-x-hidden bg-white py-12 text-bfc-black sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/#hirek"
          className="inline-flex text-sm font-semibold text-zinc-500 transition hover:text-zinc-700"
        >
          ← Vissza a hírekhez
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-black/60">
          {article.category && (
            <span className="rounded-full bg-bfc-red/10 px-3 py-1 font-semibold uppercase tracking-wide text-bfc-red">
              {article.category}
            </span>
          )}
          <time dateTime={article.publishedAt}>
            {formatMatchDate(article.publishedAt)}
          </time>
        </div>

        <h1 className="mt-4 break-words font-display text-4xl font-bold uppercase leading-tight text-bfc-black [overflow-wrap:anywhere] sm:text-5xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 break-words text-lg leading-8 text-black/70 [overflow-wrap:anywhere]">
            {article.excerpt}
          </p>
        )}

        {article.imageUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className={
                isYoutubeThumbnailUrl(article.imageUrl)
                  ? "aspect-video w-full object-cover"
                  : "mx-auto max-h-[28rem] w-full object-contain p-6"
              }
            />
          </div>
        )}

        {article.body?.length ? (
          <PortableText blocks={article.body} className="mt-8 max-w-none" />
        ) : (
          <p className="mt-8 text-black/60">Ehhez a hírhez még nincs teljes szöveg.</p>
        )}
      </div>
    </article>
  );
}
