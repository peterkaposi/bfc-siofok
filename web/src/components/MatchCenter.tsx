import { EREDMENYEK } from "@/lib/constants";
import type { Match } from "@/lib/flashscore/types";
import { isWithinLastYear } from "@/lib/utils";
import MatchCenterSplit from "./MatchCenterSplit";
import MatchRow from "./MatchRow";

interface MatchCenterProps {
  matches: Match[];
  liveMatches: Match[];
}

export default function MatchCenter({ matches, liveMatches }: MatchCenterProps) {
  const upcoming = matches.filter(
    (match) => match.status === "scheduled" || match.status === "postponed",
  );

  const recent = matches
    .filter(
      (match) =>
        match.status === "finished" && isWithinLastYear(match.date),
    )
    .slice()
    .reverse();

  return (
    <section id="meccsek" className="w-full max-w-full bg-zinc-50 py-16">
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

        <div className="mt-10">
          <MatchCenterSplit upcoming={upcoming} recent={recent} />
        </div>
      </div>
    </section>
  );
}
