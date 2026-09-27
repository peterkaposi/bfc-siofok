import { unstable_cache } from "next/cache";
import { CLUB, EREDMENYEK, FLASHSCORE_FEED_SIGN, LIVE_REVALIDATE_SECONDS, REVALIDATE_SECONDS } from "@/lib/constants";
import {
  getCurrentSeasonContext,
  parseFlashscoreHtml,
  parseMatchBroadcast,
  parseMatchDetailMeta,
  parseMatchGoals,
  parseStandingsFeed,
} from "./parser";
import type { LeagueTable, Match, StandingRow, TeamData } from "./types";

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

async function fetchMatchHighlightFeed(matchId: string): Promise<string> {
  const response = await fetch(
    `https://15.flashscore.ninja/2/x/feed/df_hi_1_${matchId}`,
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
    throw new Error(`Match highlight fetch failed: ${response.status}`);
  }

  return response.text();
}

async function fetchStandingsFeed(
  tournamentId: string,
  stageId: string,
  fresh = false,
): Promise<string> {
  const response = await fetch(
    `https://15.flashscore.ninja/2/x/feed/to_${tournamentId}_${stageId}`,
    {
      headers: {
        "x-fsign": FLASHSCORE_FEED_SIGN,
        "User-Agent":
          "Mozilla/5.0 (compatible; BFC-Website/1.0; +https://balatonfuredifc.hu)",
      },
      ...(fresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE_SECONDS } }),
    },
  );

  if (!response.ok) {
    throw new Error(`Standings fetch failed: ${response.status}`);
  }

  return response.text();
}

async function fetchMatchLiveDetail(matchId: string) {
  const [summaryResult, detailResult, highlightResult] = await Promise.allSettled([
    fetchMatchSummaryFeed(matchId),
    fetchMatchDetailFeed(matchId),
    fetchMatchHighlightFeed(matchId),
  ]);

  const summaryFeed =
    summaryResult.status === "fulfilled" ? summaryResult.value : "";
  const detailFeed =
    detailResult.status === "fulfilled" ? detailResult.value : "";
  const highlightFeed =
    highlightResult.status === "fulfilled" ? highlightResult.value : "";
  const meta = detailFeed
    ? parseMatchDetailMeta(detailFeed)
    : { isFinished: false as const };

  return {
    goals: summaryFeed ? parseMatchGoals(summaryFeed) : [],
    broadcast: highlightFeed ? parseMatchBroadcast(highlightFeed) : undefined,
    ...meta,
  };
}

function applyStandingNames(rows: StandingRow[], matches: Match[]): StandingRow[] {
  const names = new Map<string, string>();

  for (const match of matches) {
    names.set(match.homeTeam.id, match.homeTeam.name);
    names.set(match.awayTeam.id, match.awayTeam.name);
  }

  return rows.map((row) => ({
    ...row,
    teamName:
      row.teamId === EREDMENYEK.teamId
        ? CLUB.name
        : (names.get(row.teamId) ?? row.teamName),
  }));
}

export async function getLeagueStandings(
  matches: Match[],
  options?: { fresh?: boolean },
): Promise<LeagueTable | null> {
  const season = getCurrentSeasonContext(matches);
  if (!season.stageId || !season.tournamentId) return null;

  const tournamentId = season.tournamentId;
  const stageId = season.stageId;

  const load = async () => {
    const feed = await fetchStandingsFeed(
      tournamentId,
      stageId,
      options?.fresh,
    );
    return parseStandingsFeed(feed);
  };

  const rows = options?.fresh
    ? await load()
    : await unstable_cache(load, ["league-standings", tournamentId, stageId], {
        revalidate: REVALIDATE_SECONDS,
        tags: ["matches"],
      })();

  if (rows.length === 0) return null;

  return {
    title: season.title,
    rows: applyStandingNames(rows, matches),
  };
}

export async function fetchMatchGoals(matchId: string) {
  const feed = await fetchMatchSummaryFeed(matchId);
  return parseMatchGoals(feed);
}

/** Verify live matches against detail feed; mark finished and attach goals. */
export async function reconcileTeamData(data: TeamData): Promise<TeamData> {
  const liveCandidates = data.matches.filter((match) => match.status === "live");
  if (liveCandidates.length === 0) return data;

  const detailById = new Map<
    string,
    Awaited<ReturnType<typeof fetchMatchLiveDetail>>
  >();

  await Promise.all(
    liveCandidates.map(async (match) => {
      try {
        detailById.set(match.id, await fetchMatchLiveDetail(match.id));
      } catch {
        detailById.set(match.id, {
          goals: [],
          isFinished: false,
          broadcast: undefined,
        });
      }
    }),
  );

  const matches = data.matches.map((match) => {
    const detail = detailById.get(match.id);
    if (!detail) return match;

    if (detail.isFinished) {
      return {
        ...match,
        status: "finished" as const,
        feedStage: "3",
        detailStage: "3",
        goals: detail.goals,
      };
    }

    return {
      ...match,
      goals: detail.goals,
      detailStage: detail.detailStage ?? match.detailStage,
      periodStartTime: detail.periodStartTime ?? match.periodStartTime,
      broadcast: detail.broadcast ?? match.broadcast,
    };
  });

  return {
    ...data,
    matches,
    lastUpdated: new Date().toISOString(),
  };
}
