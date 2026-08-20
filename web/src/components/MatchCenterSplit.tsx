"use client";

import { useState } from "react";
import type { Match } from "@/lib/flashscore/types";
import MatchRow from "./MatchRow";

const INITIAL_VISIBLE = 2;

interface MatchCenterSplitProps {
  upcoming: Match[];
  recent: Match[];
}

const sectionTitleClass =
  "mb-4 min-h-8 font-display text-xl font-bold uppercase text-bfc-black";

function ShowMoreButton({
  expanded,
  onClick,
  className = "mt-4",
}: {
  expanded: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-bfc-black transition hover:border-bfc-red/30 hover:text-bfc-red ${className}`}
      aria-expanded={expanded}
    >
      {expanded ? "Mutass kevesebbet" : "Mutass többet"}
    </button>
  );
}

function MatchColumn({
  title,
  matches,
  emptyMessage,
  expanded,
  onToggle,
  paired,
}: {
  title: string;
  matches: Match[];
  emptyMessage: string;
  expanded: boolean;
  onToggle: () => void;
  paired?: boolean;
}) {
  const visible = expanded ? matches : matches.slice(0, INITIAL_VISIBLE);
  const hasMore = matches.length > INITIAL_VISIBLE;

  return (
    <div className="flex flex-col">
      <h3 className={sectionTitleClass}>{title}</h3>

      {matches.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/15 p-6 text-black/60">
          {emptyMessage}
        </p>
      ) : (
        <>
          <div className="grid gap-4">
            {visible.map((match) => (
              <MatchRow key={match.id} match={match} paired={paired} />
            ))}
          </div>
          {hasMore && <ShowMoreButton expanded={expanded} onClick={onToggle} />}
        </>
      )}
    </div>
  );
}

function PairedDesktopGrid({
  upcoming,
  recent,
  visibleUpcoming,
  visibleRecent,
  upcomingExpanded,
  recentExpanded,
  onToggleUpcoming,
  onToggleRecent,
}: {
  upcoming: Match[];
  recent: Match[];
  visibleUpcoming: Match[];
  visibleRecent: Match[];
  upcomingExpanded: boolean;
  recentExpanded: boolean;
  onToggleUpcoming: () => void;
  onToggleRecent: () => void;
}) {
  const upcomingHasMore = upcoming.length > INITIAL_VISIBLE;
  const recentHasMore = recent.length > INITIAL_VISIBLE;
  const rowCount = Math.max(visibleUpcoming.length, visibleRecent.length);

  return (
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-10">
      <h3 className={sectionTitleClass}>Következő meccsek</h3>
      <h3 className={sectionTitleClass}>Legutóbbi eredmények</h3>

      <div className="col-span-2 grid gap-4">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={`row-${index}`}
            className="grid grid-cols-2 items-stretch gap-x-10"
          >
            {visibleUpcoming[index] ? (
              <MatchRow match={visibleUpcoming[index]} paired />
            ) : (
              <div aria-hidden="true" />
            )}
            {visibleRecent[index] ? (
              <MatchRow match={visibleRecent[index]} paired />
            ) : (
              <div aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        {upcomingHasMore && (
          <ShowMoreButton
            expanded={upcomingExpanded}
            onClick={onToggleUpcoming}
            className=""
          />
        )}
      </div>
      <div className="mt-4">
        {recentHasMore && (
          <ShowMoreButton
            expanded={recentExpanded}
            onClick={onToggleRecent}
            className=""
          />
        )}
      </div>
    </div>
  );
}

export default function MatchCenterSplit({
  upcoming,
  recent,
}: MatchCenterSplitProps) {
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(false);

  const visibleUpcoming = upcomingExpanded
    ? upcoming
    : upcoming.slice(0, INITIAL_VISIBLE);
  const visibleRecent = recentExpanded
    ? recent
    : recent.slice(0, INITIAL_VISIBLE);

  const usePairedDesktop = upcoming.length > 0 && recent.length > 0;

  return (
    <>
      {usePairedDesktop ? (
        <PairedDesktopGrid
          upcoming={upcoming}
          recent={recent}
          visibleUpcoming={visibleUpcoming}
          visibleRecent={visibleRecent}
          upcomingExpanded={upcomingExpanded}
          recentExpanded={recentExpanded}
          onToggleUpcoming={() => setUpcomingExpanded((open) => !open)}
          onToggleRecent={() => setRecentExpanded((open) => !open)}
        />
      ) : (
        <div className="hidden lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
          <MatchColumn
            title="Következő meccsek"
            matches={upcoming}
            emptyMessage="Jelenleg nincs közelgő meccs az adatforrásban."
            expanded={upcomingExpanded}
            onToggle={() => setUpcomingExpanded((open) => !open)}
          />
          <MatchColumn
            title="Legutóbbi eredmények"
            matches={recent}
            emptyMessage="Még nincs lejátszott meccs adat."
            expanded={recentExpanded}
            onToggle={() => setRecentExpanded((open) => !open)}
          />
        </div>
      )}

      <div className="grid gap-10 lg:hidden">
        <MatchColumn
          title="Következő meccsek"
          matches={upcoming}
          emptyMessage="Jelenleg nincs közelgő meccs az adatforrásban."
          expanded={upcomingExpanded}
          onToggle={() => setUpcomingExpanded((open) => !open)}
        />
        <MatchColumn
          title="Legutóbbi eredmények"
          matches={recent}
          emptyMessage="Még nincs lejátszott meccs adat."
          expanded={recentExpanded}
          onToggle={() => setRecentExpanded((open) => !open)}
        />
      </div>
    </>
  );
}
