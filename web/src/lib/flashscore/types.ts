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
  /** Raw AB feed stage code (1=scheduled, 2=live, 12=1H, 13=2H, 38=HT, 3=finished) */
  feedStage?: string;
  /** Stage from match detail feed (DB field) — more accurate when AB=2 */
  detailStage?: string;
  /** Unix timestamp when the current period clock started (AO / DD field) */
  periodStartTime?: number;
  /** Current match minute from feed (AC field, may lag behind) */
  liveMinute?: number;
  goals?: MatchGoal[];
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
