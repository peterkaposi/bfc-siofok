import { CLUB, EREDMENYEK } from "@/lib/constants";
import type { Match } from "@/lib/flashscore/types";
import {
  formatMatchDate,
  formatMatchGoalLabel,
  formatMatchTeams,
  formatUpcomingMatchDate,
} from "@/lib/utils";
import LiveMatchClock from "./LiveMatchClock";

function teamDisplayName(match: Match, side: "home" | "away"): string {
  const team = side === "home" ? match.homeTeam : match.awayTeam;
  return team.id === EREDMENYEK.teamId ? CLUB.name : team.name;
}

function MatchGoals({ match }: { match: Match }) {
  if (!match.goals?.length) return null;

  return (
    <ul className="mt-2 space-y-1 text-sm text-black/70">
      {match.goals.map((goal, index) => (
        <li key={`${goal.minute}-${goal.playerName}-${index}`}>
          ⚽ {formatMatchGoalLabel(goal)} (
          {teamDisplayName(match, goal.teamSide)})
        </li>
      ))}
    </ul>
  );
}

export default function MatchRow({ match }: { match: Match }) {
  return (
    <article className="min-w-0 grid gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div className="min-w-0 self-center">
        <p className="break-words text-xs uppercase tracking-[0.15em] text-black/50 [overflow-wrap:anywhere]">
          {match.competition ?? "Bajnokság"}
          {match.round ? ` · ${match.round}. forduló` : ""}
        </p>
        <p className="mt-1 font-display text-xl font-bold text-bfc-black">
          {formatMatchTeams(match)}
        </p>
        <p className="mt-1 text-sm text-black/60">
          {match.status === "live" ? (
            <LiveMatchClock match={match} variant="meta" />
          ) : match.status === "scheduled" ? (
            `${formatUpcomingMatchDate(match.date)} · ${match.isHome ? "Hazai pálya" : "Idegenbeli"}`
          ) : (
            `${formatMatchDate(match.date)} · ${match.isHome ? "Hazai pálya" : "Idegenbeli"}`
          )}
        </p>
        <MatchGoals match={match} />
      </div>

      <span
        className={`inline-flex w-fit shrink-0 self-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${
          match.status === "live"
            ? "bg-bfc-red text-white"
            : match.status === "finished"
              ? "bg-black/10 text-black/70"
              : "bg-bfc-red/10 text-bfc-red"
        }`}
      >
        {match.status === "live" ? (
          <LiveMatchClock match={match} variant="badge" />
        ) : match.status === "finished" ? (
          "Lezárult"
        ) : match.status === "postponed" ? (
          "Elhalasztva"
        ) : (
          "Következő"
        )}
      </span>

      <a
        href={`${EREDMENYEK.baseUrl}/merkozes/foci/${match.id}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit shrink-0 self-center items-center justify-center rounded-full bg-bfc-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Részletek
      </a>
    </article>
  );
}
