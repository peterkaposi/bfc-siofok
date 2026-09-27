export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

export interface TeamInfo {
  id: string;
  name: string;
  slug?: string;
}

export interface MatchGoal {
  minute: string;
  playerName: string;
  teamSide: "home" | "away";
  type: "goal" | "penalty" | "own_goal";
}

export interface Match {
  id: string;
  date: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  competition?: string;
  stageId?: string;
  tournamentId?: string;
  round?: string;
  isHome: boolean;
  /** Raw AB feed code (1=scheduled, 2=live, 3=finished) */
  feedStage?: string;
  /**
   * Period while the match is live (AC field): 12=1st half, 13=2nd half,
   * 38=half time, 46=break, 6=extra time, 7=penalties.
   */
  periodStage?: string;
  /** Stage from match detail feed (DB field) — more accurate when AB=2 */
  detailStage?: string;
  /** Unix timestamp when the current period clock started (AO / DD field) */
  periodStartTime?: number;
  /** Optional minute hint. Not the AC stage code. */
  liveMinute?: number;
  goals?: MatchGoal[];
  /** Published live stream for an in-play match */
  broadcast?: MatchBroadcast;
}

export interface MatchBroadcast {
  url: string;
  provider?: string;
}

export interface TeamStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  /** q1 = promotion place, r1 = relegation place */
  zone?: string;
}

export interface LeagueTable {
  title: string;
  rows: StandingRow[];
}

export interface TeamSummary {
  lastMatch?: Match;
  nextMatch?: Match;
  liveMatches: Match[];
  stats: TeamStats;
}

export interface TeamData {
  teamId: string;
  teamName: string;
  matches: Match[];
  lastUpdated: string;
}
