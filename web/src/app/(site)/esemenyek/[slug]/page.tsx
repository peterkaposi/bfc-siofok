import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/sanity/client";
import { formatEventDate } from "@/lib/utils";

export const revalidate = 60;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Esemény nem található" };
  }

  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <article className="bg-white py-12 text-bfc-black sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/#esemenyek"
          className="inline-flex text-sm font-semibold text-zinc-500 transition hover:text-zinc-700"
        >
          ← Vissza az eseményekhez
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-bfc-red">
          {formatEventDate(event.date)}
        </p>

        <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-tight text-bfc-black sm:text-5xl">
          {event.title}
        </h1>

        {event.location && (
          <p className="mt-4 text-lg text-black/70">{event.location}</p>
        )}

        {event.description ? (
          <p className="mt-8 whitespace-pre-line text-base leading-8 text-black/80">
            {event.description}
          </p>
        ) : (
          <p className="mt-8 text-black/60">Ehhez az eseményhez még nincs leírás.</p>
        )}
      </div>
    </article>
  );
}
