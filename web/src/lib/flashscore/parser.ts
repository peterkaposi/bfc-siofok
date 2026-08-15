import { EREDMENYEK } from "@/lib/constants";
import type {
  Match,
  MatchGoal,
  MatchStatus,
  TeamData,
  TeamStats,
  TeamSummary,
} from "./types";

const FEED_KEYS = [
  "fixtures",
  "results",
  "summary",
  "summary-fixtures",
  "summary-results",
  "squad",
  "transfers",
];

function extractFeedBlocks(html: string): string[] {
  const blocks: string[] = [];

  const dataBlockPattern = /data:\s*`([^`]+)`/g;
  let match: RegExpExecArray | null;
  while ((match = dataBlockPattern.exec(html)) !== null) {
    blocks.push(match[1]);
  }

  for (const key of FEED_KEYS) {
    const feedPattern = new RegExp(
      `initialFeeds\\["${key}"\\]\\s*=\\s*['"\`]([^'"\`]+)['"\`]`,
      "g",
    );
    while ((match = feedPattern.exec(html)) !== null) {
      blocks.push(match[1]);
    }
  }

  return blocks;
}

function parseFeedRecord(record: string): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const part of record.split("¬")) {
    const divider = part.indexOf("÷");
    if (divider === -1) continue;
    fields[part.slice(0, divider)] = part.slice(divider + 1);
  }

  return fields;
}

function parseScore(value?: string): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function mapFeedStatus(raw?: string): MatchStatus {
  switch (raw) {
    case "1":
    case "2":
    case "12":
    case "13":
    case "38":
    case "46":
      return "live";
    case "3":
      return "finished";
    case "4":
    case "5":
      return "postponed";
    case "6":
      return "cancelled";
    default:
      return "scheduled";
  }
}

const MATCH_WINDOW_MS = 2.5 * 60 * 60 * 1000;
const KICKOFF_BUFFER_MS = 5 * 60 * 1000;

function resolveMatchStatus(
  feedStatus: MatchStatus,
  dateIso: string,
  homeScore?: number,
  awayScore?: number,
): MatchStatus {
  const kickoff = new Date(dateIso).getTime();
  const now = Date.now();

  if (feedStatus === "postponed" || feedStatus === "cancelled") {
    return feedStatus;
  }

  if (feedStatus === "finished") {
    return "finished";
  }

  // Kickoff still in the future → always upcoming, even if feed flags in-play codes.
  if (kickoff > now + KICKOFF_BUFFER_MS) {
    return "scheduled";
  }

  const inMatchWindow =
    kickoff <= now + KICKOFF_BUFFER_MS && now <= kickoff + MATCH_WINDOW_MS;

  if (inMatchWindow && feedStatus === "live") {
    return "live";
  }

  if (kickoff + MATCH_WINDOW_MS < now) {
    return homeScore !== undefined && awayScore !== undefined
      ? "finished"
      : feedStatus === "live"
        ? "finished"
        : "scheduled";
  }

  return "scheduled";
}

function timestampToIso(raw?: string): string | null {
  if (!raw) return null;
  const timestamp = Number.parseInt(raw, 10);
  if (Number.isNaN(timestamp)) return null;
  return new Date(timestamp * 1000).toISOString();
}

function recordToMatch(
  fields: Record<string, string>,
  teamId: string,
): Match | null {
  const id = fields.AA;
  const date = timestampToIso(fields.AD);
  const homeTeamId = fields.PX;
  const awayTeamId = fields.PY;

  if (!id || !date || !homeTeamId || !awayTeamId) {
    return null;
  }

  const homeTeam = {
    id: homeTeamId,
    name: fields.FH ?? fields.AE ?? fields.CX ?? "Ismeretlen",
    slug: fields.WU,
  };

  const awayTeam = {
    id: awayTeamId,
    name: fields.FK ?? fields.AF ?? "Ismeretlen",
    slug: fields.WV,
  };

  const homeScore = parseScore(fields.AT) ?? parseScore(fields.GRA);
  const awayScore = parseScore(fields.AU) ?? parseScore(fields.GRB);
  const feedStage = fields.AB;
  const feedStatus = mapFeedStatus(feedStage ?? fields.AC);

  return {
    id,
    date,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status: resolveMatchStatus(feedStatus, date, homeScore, awayScore),
    competition: fields.ZA,
    round: fields.ER,
    isHome: homeTeamId === teamId,
    feedStage,
    liveMinute: parseScore(fields.AC),
    periodStartTime: parseScore(fields.AO),
  };
}

export function parseMatchDetailStage(feed: string): string | undefined {
  const record = feed.split("~")[0];
  return parseFeedRecord(record).DB;
}

export function parseMatchDetailMeta(feed: string): {
  detailStage?: string;
  periodStartTime?: number;
} {
  const fields = parseFeedRecord(feed.split("~")[0]);
  return {
    detailStage: fields.DB,
    periodStartTime: parseScore(fields.DD) ?? parseScore(fields.AO),
  };
}

export function parseMatchGoals(feed: string): MatchGoal[] {
  const goals: MatchGoal[] = [];

  for (const record of feed.split("~")) {
    const fields = parseFeedRecord(record);
    if (!fields.III) continue;

    const eventLabel = fields.IK ?? "";
    const isGoal =
      eventLabel === "Goal" ||
      eventLabel === "Penalty" ||
      fields.IE === "3" ||
      fields.IE === "10";

    if (!isGoal || !fields.IF) continue;

    goals.push({
      minute: fields.IB ?? "",
      playerName: fields.IF,
      teamSide: fields.IA === "2" ? "away" : "home",
      type:
        eventLabel === "Penalty" || fields.IE === "10" ? "penalty" : "goal",
    });
  }

  return goals;
}

function parseFeedBlock(block: string, teamId: string): Match[] {
  const matches: Match[] = [];
  const seen = new Set<string>();
  let competition: string | undefined;
  let stageId: string | undefined;
  let tournamentId: string | undefined;

  for (const record of block.split("~")) {
    const fields = parseFeedRecord(record);

    if (fields.ZA && !fields.AA) {
      competition = fields.ZA;
      stageId = fields.ZC;
      tournamentId = fields.ZE;
      continue;
    }

    if (!fields.AA) continue;

    const homeId = fields.PX;
    const awayId = fields.PY;
    if (homeId !== teamId && awayId !== teamId) continue;

    const parsed = recordToMatch(fields, teamId);
    if (!parsed || seen.has(parsed.id)) continue;

    parsed.competition = competition;
    parsed.stageId = stageId;
    parsed.tournamentId = tournamentId;

    seen.add(parsed.id);
    matches.push(parsed);
  }

  return matches;
}

export function parseFlashscoreHtml(
  html: string,
  teamId: string = EREDMENYEK.teamId,
): TeamData {
  const blocks = extractFeedBlocks(html);
  const matchMap = new Map<string, Match>();

  for (const block of blocks) {
    for (const match of parseFeedBlock(block, teamId)) {
      matchMap.set(match.id, match);
    }
  }

  const matches = Array.from(matchMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const teamName =
    matches.find((m) => m.isHome)?.homeTeam.name ??
    matches.find((m) => !m.isHome)?.awayTeam.name ??
    "BFC Siófok";

  return {
    teamId,
    teamName,
    matches,
    lastUpdated: new Date().toISOString(),
  };
}

function isPrimaryLeagueMatch(match: Match): boolean {
  return match.competition?.includes(EREDMENYEK.primaryLeague) ?? false;
}

function getCurrentSeasonStageId(matches: Match[]): string | undefined {
  const leagueMatches = matches.filter(isPrimaryLeagueMatch);

  const stagesWithFixtures = leagueMatches.filter(
    (match) =>
      match.stageId &&
      (match.status === "scheduled" ||
        match.status === "postponed" ||
        match.status === "live"),
  );

  if (stagesWithFixtures.length > 0) {
    const byStage = new Map<string, number>();

    for (const match of stagesWithFixtures) {
      const id = match.stageId!;
      const kickoff = new Date(match.date).getTime();
      const nearest = byStage.get(id);

      if (nearest === undefined || Math.abs(kickoff - Date.now()) < Math.abs(nearest - Date.now())) {
        byStage.set(id, kickoff);
      }
    }

    return [...byStage.entries()].sort(
      (a, b) => Math.abs(a[1] - Date.now()) - Math.abs(b[1] - Date.now()),
    )[0]?.[0];
  }

  return leagueMatches
    .filter((match) => match.status === "finished" && match.stageId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    ?.stageId;
}

function computeSeasonStats(matches: Match[]): TeamStats {
  const stageId = getCurrentSeasonStageId(matches);

  const finished = matches.filter(
    (match) =>
      match.status === "finished" &&
      isPrimaryLeagueMatch(match) &&
      (!stageId || match.stageId === stageId),
  );

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const match of finished) {
    const gf = match.isHome
      ? (match.homeScore ?? 0)
      : (match.awayScore ?? 0);
    const ga = match.isHome
      ? (match.awayScore ?? 0)
      : (match.homeScore ?? 0);

    goalsFor += gf;
    goalsAgainst += ga;

    if (gf > ga) wins += 1;
    else if (gf === ga) draws += 1;
    else losses += 1;
  }

  return {
    played: finished.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    points: wins * 3 + draws,
  };
}

export function summarizeTeamData(data: TeamData): TeamSummary {
  const now = Date.now();

  const finished = data.matches
    .filter((match) => match.status === "finished")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcoming = data.matches
    .filter(
      (match) =>
        (match.status === "scheduled" ||
          match.status === "postponed" ||
          match.status === "live") &&
        new Date(match.date).getTime() >= now - 2 * 60 * 60 * 1000,
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const liveMatches = data.matches.filter((match) => match.status === "live");

  return {
    lastMatch: finished[0],
    nextMatch: upcoming.find((match) => match.status !== "live") ?? upcoming[0],
    liveMatches,
    stats: computeSeasonStats(data.matches),
  };
}
