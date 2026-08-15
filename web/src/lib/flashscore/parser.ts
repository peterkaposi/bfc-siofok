import { EREDMENYEK } from "@/lib/constants";
import type { Match, MatchStatus, TeamData, TeamSummary } from "./types";

const FEED_KEYS = ["fixtures", "results", "summary", "squad", "transfers"];

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

function mapStatus(raw?: string): MatchStatus {
  switch (raw) {
    case "1":
    case "2":
    case "12":
    case "13":
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
  const homeTeamId = fields.AG ?? fields.AH;
  const awayTeamId = fields.AI ?? fields.AJ ?? fields.AK;

  if (!id || !date || !homeTeamId || !awayTeamId) {
    return null;
  }

  const homeTeam = {
    id: homeTeamId,
    name: fields.AF ?? fields.CX ?? "Ismeretlen",
    slug: fields.WU,
  };

  const awayTeam = {
    id: awayTeamId,
    name: fields.AH ?? fields.CY ?? "Ismeretlen",
    slug: fields.WW,
  };

  return {
    id,
    date,
    homeTeam,
    awayTeam,
    homeScore: parseScore(fields.AT),
    awayScore: parseScore(fields.AU),
    status: mapStatus(fields.AB ?? fields.AC ?? fields.AW),
    competition: fields.ZA ?? fields.ZY,
    round: fields.AE,
    isHome: homeTeamId === teamId,
  };
}

function parseFeedBlock(block: string, teamId: string): Match[] {
  const matches: Match[] = [];
  const seen = new Set<string>();

  for (const record of block.split("~")) {
    const fields = parseFeedRecord(record);
    if (!fields.AA) continue;

    const homeId = fields.AG;
    const awayId = fields.AI ?? fields.AJ ?? fields.AK;
    if (homeId !== teamId && awayId !== teamId) continue;

    const parsed = recordToMatch(fields, teamId);
    if (!parsed || seen.has(parsed.id)) continue;

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
    "Balatonfüredi FC";

  return {
    teamId,
    teamName,
    matches,
    lastUpdated: new Date().toISOString(),
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
    lastMatch: finished[0],
    nextMatch: upcoming.find((match) => match.status !== "live") ?? upcoming[0],
    liveMatches,
    stats: {
      played: finished.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      points: wins * 3 + draws,
    },
  };
}
