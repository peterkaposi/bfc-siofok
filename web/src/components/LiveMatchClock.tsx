"use client";

import type { Match } from "@/lib/flashscore/types";
import { formatLiveBadge, formatLiveMinute } from "@/lib/utils";
import { useEffect, useState } from "react";

type LiveMatchClockVariant = "minute" | "badge" | "meta";

interface LiveMatchClockProps {
  match: Match;
  variant: LiveMatchClockVariant;
}

function getClockLabel(match: Match, variant: LiveMatchClockVariant): string {
  const minute = formatLiveMinute(match);

  if (variant === "minute") {
    return minute ?? "Élő";
  }

  if (variant === "badge") {
    return formatLiveBadge(match);
  }

  if (minute) {
    return `${minute} · ${match.isHome ? "Hazai pálya" : "Idegenbeli"}`;
  }

  return match.isHome ? "Hazai pálya" : "Idegenbeli";
}

export default function LiveMatchClock({
  match,
  variant,
}: LiveMatchClockProps) {
  const [label, setLabel] = useState(() => getClockLabel(match, variant));

  useEffect(() => {
    const update = () => setLabel(getClockLabel(match, variant));
    update();

    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [match, variant]);

  return <>{label}</>;
}
