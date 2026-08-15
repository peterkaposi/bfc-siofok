import type { Player } from "@/lib/sanity/client";

interface PlayersSectionProps {
  players: Player[];
}

export default function PlayersSection({ players }: PlayersSectionProps) {
  return (
    <section id="jatekosok" className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
            Keret
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase text-bfc-black">
            Játékosok
          </h2>
        </div>

        {players.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white p-8 text-black/60">
            <p className="font-medium text-bfc-black">
              A játékoslista hamarosan érkezik.
            </p>
            <p className="mt-2 text-sm">
              A játékosok a Sanity CMS-ben adhatók hozzá (név, fotó, pozíció,
              mezszám).
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {players.map((player) => (
              <article
                key={player._id}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
              >
                {player.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="h-56 w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-bfc-black">
                    <span className="font-display text-4xl font-bold text-bfc-red">
                      {player.number ?? "?"}
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-bfc-black">
                      {player.name}
                    </h3>
                    {player.number !== undefined && (
                      <span className="rounded-full bg-bfc-red px-2.5 py-1 text-sm font-bold text-white">
                        {player.number}
                      </span>
                    )}
                  </div>
                  {player.position && (
                    <p className="mt-1 text-sm text-black/60">{player.position}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
