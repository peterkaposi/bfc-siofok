import { EREDMENYEK } from "@/lib/constants";
import type { Match } from "@/lib/flashscore/types";
import {
  formatMatchDate,
  formatRelativeDate,
  getMatchScoreLabel,
} from "@/lib/utils";

interface MatchCenterProps {
  matches: Match[];
  liveMatches: Match[];
}

function MatchRow({ match }: { match: Match }) {
  const opponent = match.isHome ? match.awayTeam.name : match.homeTeam.name;

  return (
    <article className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-black/50">
          {match.competition ?? "Bajnokság"}
          {match.round ? ` · ${match.round}. forduló` : ""}
        </p>
        <p className="mt-1 font-display text-xl font-bold text-bfc-black">
          {match.isHome ? "BFC" : opponent}{" "}
          <span className="text-bfc-red">{getMatchScoreLabel(match)}</span>{" "}
          {match.isHome ? opponent : "BFC"}
        </p>
        <p className="mt-1 text-sm text-black/60">
          {match.status === "scheduled"
            ? formatRelativeDate(match.date)
            : formatMatchDate(match.date)}{" "}
          · {match.isHome ? "Hazai pálya" : "Idegenbeli"}
        </p>
      </div>

      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase ${
          match.status === "live"
            ? "bg-bfc-red text-white"
            : match.status === "finished"
              ? "bg-black/10 text-black/70"
              : "bg-bfc-red/10 text-bfc-red"
        }`}
      >
        {match.status === "live"
          ? "Élő"
          : match.status === "finished"
            ? "Lezárult"
            : match.status === "postponed"
              ? "Elhalasztva"
              : "Következő"}
      </span>

      <a
        href={`${EREDMENYEK.baseUrl}/merkozes/foci/${match.id}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-bfc-red hover:underline"
      >
        Részletek
      </a>
    </article>
  );
}

export default function MatchCenter({ matches, liveMatches }: MatchCenterProps) {
  const upcoming = matches
    .filter(
      (match) =>
        match.status === "scheduled" ||
        match.status === "postponed" ||
        match.status === "live",
    )
    .slice(0, 5);

  const recent = matches
    .filter((match) => match.status === "finished")
    .slice(-5)
    .reverse();

  return (
    <section id="meccsek" className="bg-zinc-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
              Meccsközpont
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase text-bfc-black">
              Eredmények és program
            </h2>
          </div>
          <a
            href={EREDMENYEK.teamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-bfc-red hover:underline"
          >
            Teljes naptár az Eredmenyek.com-on
          </a>
        </div>

        {liveMatches.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 font-display text-xl font-bold uppercase text-bfc-red">
              Élő meccsek
            </h3>
            <div className="grid gap-4">
              {liveMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 font-display text-xl font-bold uppercase text-bfc-black">
              Következő meccsek
            </h3>
            <div className="grid gap-4">
              {upcoming.length > 0 ? (
                upcoming.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-black/15 p-6 text-black/60">
                  Jelenleg nincs közelgő meccs az adatforrásban.
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-xl font-bold uppercase text-bfc-black">
              Legutóbbi eredmények
            </h3>
            <div className="grid gap-4">
              {recent.length > 0 ? (
                recent.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-black/15 p-6 text-black/60">
                  Még nincs lejátszott meccs adat.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
