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

export interface Match {
  id: string;
  date: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  competition?: string;
  round?: string;
  isHome: boolean;
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
