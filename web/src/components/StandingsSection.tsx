import { CLUB } from "@/lib/constants";
import type { TeamStats } from "@/lib/flashscore/types";

interface StandingsSectionProps {
  stats: TeamStats;
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-bfc-red/30 bg-bfc-red text-white"
          : "border-white/10 bg-white/5 text-white"
      }`}
    >
      <p
        className={`text-xs uppercase tracking-[0.15em] ${
          accent ? "text-white/80" : "text-white/60"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function StandingsSection({ stats }: StandingsSectionProps) {
  const goalDifference = stats.goalsFor - stats.goalsAgainst;

  return (
    <section id="tabella" className="bg-bfc-black py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
            Szezon statisztika
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase">
            {CLUB.name} teljesítmény
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            Az aktuális NB III szezon lejátszott bajnoki meccsei alapján.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <StatCard label="Lejátszott" value={stats.played} accent />
          <StatCard label="Győzelem" value={stats.wins} />
          <StatCard label="Döntetlen" value={stats.draws} />
          <StatCard label="Vereség" value={stats.losses} />
          <StatCard label="Lőtt gól" value={stats.goalsFor} />
          <StatCard label="Kapott gól" value={stats.goalsAgainst} />
          <StatCard
            label="Gólkülönbség"
            value={goalDifference > 0 ? `+${goalDifference}` : goalDifference}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/70">Szezonbeli pontok:</p>
          <p className="mt-2 font-display text-4xl font-bold text-bfc-red">
            {stats.points} pont
          </p>
        </div>
      </div>
    </section>
  );
}
