import Link from "next/link";
import type { NewsArticle } from "@/lib/sanity/client";
import { CLUB } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/utils";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  return (
    <section id="hirek" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
              Hírek
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase text-bfc-black">
              Klubhírek
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/hirek/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-zinc-50 shadow-sm transition hover:-translate-y-0.5 hover:border-bfc-red/30 hover:shadow-md"
            >
              {article.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-44 items-end bg-bfc-black p-4">
                  <span className="font-display text-2xl font-bold uppercase text-bfc-red">
                    {CLUB.name}
                  </span>
                </div>
              )}

              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-black/50">
                  {formatRelativeDate(article.publishedAt)}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-bfc-black group-hover:text-bfc-red">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-3 text-sm leading-6 text-black/70">
                    {article.excerpt}
                  </p>
                )}
                <p className="mt-4 text-sm font-semibold text-bfc-red">
                  Tovább olvasom →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
