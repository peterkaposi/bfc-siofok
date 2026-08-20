import type { Player } from "@/lib/sanity/client";
import MobileCardCarousel from "./MobileCardCarousel";

interface PlayersSectionProps {
  players: Player[];
}

function PlayerAvatar() {
  return (
    <div className="flex aspect-[3/2] items-center justify-center bg-zinc-200">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-12 w-12 text-zinc-400"
        aria-hidden="true"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      {player.photoUrl ? (
        <div className="flex aspect-[3/2] items-center justify-center bg-zinc-100 p-2 sm:p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={player.photoUrl}
            alt={player.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <PlayerAvatar />
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-tight text-bfc-black">
            {player.name}
          </h3>
          {player.number !== undefined && (
            <span className="rounded-full bg-bfc-red px-2 py-0.5 text-xs font-bold text-white">
              {player.number}
            </span>
          )}
        </div>
        {player.position && (
          <p className="mt-0.5 text-xs text-black/60">{player.position}</p>
        )}
      </div>
    </article>
  );
}

export default function PlayersSection({ players }: PlayersSectionProps) {
  return (
    <section id="jatekosok" className="w-full max-w-full bg-zinc-50 py-16">
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
          <>
            <div className="mt-10">
            <MobileCardCarousel itemCount={players.length}>
              {players.map((player) => (
                <div
                  key={player._id}
                  className="w-[56vw] max-w-[240px] shrink-0 snap-center"
                >
                  <PlayerCard player={player} />
                </div>
              ))}
            </MobileCardCarousel>
            </div>

            <div className="mt-10 hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {players.map((player) => (
                <PlayerCard key={player._id} player={player} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
