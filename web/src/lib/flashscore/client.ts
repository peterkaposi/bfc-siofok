import { unstable_cache } from "next/cache";
import {
  EREDMENYEK,
  FLASHSCORE_FEED_SIGN,
  LIVE_REVALIDATE_SECONDS,
  REVALIDATE_SECONDS,
} from "@/lib/constants";
import {
  parseFlashscoreHtml,
  parseMatchDetailMeta,
  parseMatchGoals,
} from "./parser";
import type { Match, TeamData } from "./types";

async function fetchTeamHtml(options?: { fresh?: boolean }): Promise<string> {
  const response = await fetch(EREDMENYEK.teamUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; BFC-Website/1.0; +https://balatonfuredifc.hu)",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "hu-HU,hu;q=0.9",
    },
    ...(options?.fresh
      ? { cache: "no-store" as const }
      : { next: { revalidate: REVALIDATE_SECONDS } }),
  });

  if (!response.ok) {
    throw new Error(`Eredmenyek fetch failed: ${response.status}`);
  }

  return response.text();
}

export async function getTeamData(): Promise<TeamData> {
  return unstable_cache(
    async () => {
      const html = await fetchTeamHtml();
      return parseFlashscoreHtml(html, EREDMENYEK.teamId);
    },
    ["flashscore-team-data", EREDMENYEK.teamId],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: ["matches", `team-${EREDMENYEK.teamId}`],
    },
  )();
}

export async function refreshTeamData(): Promise<TeamData> {
  const html = await fetchTeamHtml({ fresh: true });
  return parseFlashscoreHtml(html, EREDMENYEK.teamId);
}

const liveFetchOptions = {
  cache: "no-store" as const,
  next: { revalidate: LIVE_REVALIDATE_SECONDS },
};

async function fetchMatchSummaryFeed(matchId: string): Promise<string> {
  const response = await fetch(
    `https://15.flashscore.ninja/2/x/feed/df_sui_1_${matchId}`,
    {
      headers: {
        "x-fsign": FLASHSCORE_FEED_SIGN,
        "User-Agent":
          "Mozilla/5.0 (compatible; BFC-Website/1.0; +https://balatonfuredifc.hu)",
      },
      ...liveFetchOptions,
    },
  );

  if (!response.ok) {
    throw new Error(`Match summary fetch failed: ${response.status}`);
  }

  return response.text();
}

async function fetchMatchDetailFeed(matchId: string): Promise<string> {
  const response = await fetch(
    `https://15.flashscore.ninja/2/x/feed/dc_1_${matchId}`,
    {
      headers: {
        "x-fsign": FLASHSCORE_FEED_SIGN,
        "User-Agent":
          "Mozilla/5.0 (compatible; BFC-Website/1.0; +https://balatonfuredifc.hu)",
      },
      ...liveFetchOptions,
    },
  );

  if (!response.ok) {
    throw new Error(`Match detail fetch failed: ${response.status}`);
  }

  return response.text();
}

async function fetchMatchLiveDetail(matchId: string) {
  const [summaryFeed, detailFeed] = await Promise.all([
    fetchMatchSummaryFeed(matchId),
    fetchMatchDetailFeed(matchId),
  ]);

  return {
    goals: parseMatchGoals(summaryFeed),
    ...parseMatchDetailMeta(detailFeed),
  };
}

export async function fetchMatchGoals(matchId: string) {
  const feed = await fetchMatchSummaryFeed(matchId);
  return parseMatchGoals(feed);
}

export async function enrichLiveMatchesWithGoals(
  matches: Match[],
): Promise<Match[]> {
  const live = matches.filter((match) => match.status === "live");
  if (live.length === 0) return matches;

  const detailsById = new Map<
    string,
    Awaited<ReturnType<typeof fetchMatchLiveDetail>>
  >();

  await Promise.all(
    live.map(async (match) => {
      try {
        detailsById.set(match.id, await fetchMatchLiveDetail(match.id));
      } catch {
        detailsById.set(match.id, { goals: [], detailStage: undefined });
      }
    }),
  );

  return matches.map((match) => {
    const detail = detailsById.get(match.id);
    if (!detail) return match;

    return {
      ...match,
      goals: detail.goals,
      detailStage: detail.detailStage ?? match.detailStage,
      periodStartTime: detail.periodStartTime ?? match.periodStartTime,
    };
  });
}
