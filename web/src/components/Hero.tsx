import { CLUB } from "@/lib/constants";
import type { Match } from "@/lib/flashscore/types";
import {
  formatMatchDate,
  formatMatchTeams,
  formatRelativeDate,
} from "@/lib/utils";

interface HeroProps {
  nextMatch?: Match;
  lastMatch?: Match;
}

function MatchPill({
  label,
  match,
  variant,
}: {
  label: string;
  match?: Match;
  variant: "next" | "last";
}) {
  if (!match) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
          {label}
        </p>
        <p className="mt-2 text-sm text-white/70">Nincs elérhető adat</p>
      </div>
    );
  }

  const venue = match.isHome ? "Hazai" : "Vendég";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        variant === "next"
          ? "border-bfc-red/40 bg-bfc-red/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
      <p className="mt-2 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
        {formatMatchTeams(match)}
      </p>
      <p className="mt-2 text-xs text-white/60">
        {variant === "next"
          ? formatRelativeDate(match.date)
          : formatMatchDate(match.date)}{" "}
        · {venue}
      </p>
    </div>
  );
}

export default function Hero({ nextMatch, lastMatch }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-bfc-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,5,40,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(220,5,40,0.15),transparent_40%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
        <div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl lg:text-6xl">
            {CLUB.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{CLUB.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="rounded-full border border-white/15 px-3 py-1">
              {CLUB.city}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">
              Alapítva: {CLUB.founded}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">
              {CLUB.stadium}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <MatchPill label="Következő meccs" match={nextMatch} variant="next" />
          <MatchPill label="Utolsó meccs" match={lastMatch} variant="last" />
        </div>
      </div>
    </section>
  );
}
