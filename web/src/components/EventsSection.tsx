import type { ClubEvent } from "@/lib/sanity/client";
import { formatEventDate } from "@/lib/utils";

interface EventsSectionProps {
  events: ClubEvent[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  return (
    <section id="esemenyek" className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
            Események
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase text-bfc-black">
            Közelgő programok
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white p-8 text-black/60">
            <p className="font-medium text-bfc-black">
              Jelenleg nincs közelgő esemény.
            </p>
            <p className="mt-2 text-sm">
              Az események a Sanity CMS-ben adhatók hozzá, amint a projekt
              konfigurálva van.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-4">
            {events.map((event) => (
              <article
                key={event._id}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-bfc-red">
                  {formatEventDate(event.date)}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-bfc-black">
                  {event.title}
                </h3>
                {event.location && (
                  <p className="mt-2 text-sm text-black/60">{event.location}</p>
                )}
                {event.description && (
                  <p className="mt-3 text-sm leading-6 text-black/70">
                    {event.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
