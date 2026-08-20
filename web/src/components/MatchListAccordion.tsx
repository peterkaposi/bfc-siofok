"use client";

import { useState } from "react";
import type { Match } from "@/lib/flashscore/types";
import MatchRow from "./MatchRow";

const INITIAL_VISIBLE = 2;

interface MatchListAccordionProps {
  matches: Match[];
  emptyMessage: string;
}

export default function MatchListAccordion({
  matches,
  emptyMessage,
}: MatchListAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  if (matches.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-black/15 p-6 text-black/60">
        {emptyMessage}
      </p>
    );
  }

  const visible = expanded ? matches : matches.slice(0, INITIAL_VISIBLE);
  const hasMore = matches.length > INITIAL_VISIBLE;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4">
        {visible.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-auto w-full shrink-0 rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-bfc-black transition hover:border-bfc-red/30 hover:text-bfc-red"
          aria-expanded={expanded}
        >
          {expanded ? "Mutass kevesebbet" : "Mutass többet"}
        </button>
      )}
    </div>
  );
}
