import { CLUB, EREDMENYEK } from "@/lib/constants";
import type { Match, MatchGoal } from "@/lib/flashscore/types";

const TIMEZONE = "Europe/Budapest";

const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIMEZONE,
});

const timeFormatter = new Intl.DateTimeFormat("hu-HU", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIMEZONE,
});

function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

function dateKeyInTimeZone(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isSameDay(a: Date, b: Date): boolean {
  return dateKeyInTimeZone(a) === dateKeyInTimeZone(b);
}

function dayDiff(target: Date, now: Date): number {
  const targetKey = dateKeyInTimeZone(target);
  const nowKey = dateKeyInTimeZone(now);
  const targetMs = new Date(`${targetKey}T12:00:00`).getTime();
  const nowMs = new Date(`${nowKey}T12:00:00`).getTime();
  return Math.round((targetMs - nowMs) / (1000 * 60 * 60 * 24));
}

export function formatMatchDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function isWithinLastYear(date: string): boolean {
  const target = new Date(date);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  return target >= cutoff;
}

export function formatRelativeDate(date: string): string {
  const target = new Date(date);
  const now = new Date();
  const diffDays = dayDiff(target, now);

  if (isSameDay(target, now)) {
    return `Ma, ${formatTime(target)}`;
  }

  if (diffDays === 1) {
    return `Holnap, ${formatTime(target)}`;
  }

  if (diffDays === -1) {
    return `Tegnap, ${formatTime(target)}`;
  }

  if (diffDays > 1 && diffDays <= 7) {
    return `${diffDays} nap múlva, ${formatTime(target)}`;
  }

  if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} napja, ${formatTime(target)}`;
  }

  return formatMatchDate(date);
}

/** Upcoming match: full date and time only. */
export function formatUpcomingMatchDate(date: string): string {
  return formatMatchDate(date);
}

export function getMatchScoreLabel(match: Match): string {
  if (match.status === "live") {
    return `${match.homeScore ?? 0} : ${match.awayScore ?? 0}`;
  }

  if (match.status === "finished") {
    return `${match.homeScore ?? "-"} : ${match.awayScore ?? "-"}`;
  }

  if (match.status === "postponed") return "Elhalasztva";
  if (match.status === "cancelled") return "Törölve";

  return "-";
}

function teamLabel(team: { id: string; name: string }): string {
  return team.id === EREDMENYEK.teamId ? CLUB.name : team.name;
}

const HALFTIME_STAGES = new Set(["38", "46"]);

function resolveLiveStage(match: Match): string | undefined {
  if (match.detailStage && match.detailStage !== "2") {
    return match.detailStage;
  }

  if (match.feedStage && match.feedStage !== "2") {
    return match.feedStage;
  }

  return match.detailStage ?? match.feedStage;
}

export function computeLiveMinute(
  match: Match,
  nowMs = Date.now(),
): string | null {
  if (match.status !== "live") return null;

  const stage = resolveLiveStage(match);

  if (stage === "3" || match.feedStage === "3" || match.detailStage === "3") {
    return null;
  }

  if (stage && HALFTIME_STAGES.has(stage)) {
    return "Félidő";
  }

  const periodStartSec =
    match.periodStartTime ??
    Math.floor(new Date(match.date).getTime() / 1000);
  const elapsed = Math.max(
    0,
    Math.floor((nowMs / 1000 - periodStartSec) / 60),
  );

  if (stage === "13") {
    return `${45 + elapsed}'`;
  }

  if (elapsed > 0 || match.periodStartTime || stage === "12") {
    return `${elapsed}'`;
  }

  const feedMinute = match.liveMinute;
  if (feedMinute !== undefined) {
    if (stage === "13") {
      return feedMinute <= 45 ? `${45 + feedMinute}'` : `${feedMinute}'`;
    }
    return `${feedMinute}'`;
  }

  return null;
}

export function formatLiveMinute(match: Match): string | null {
  return computeLiveMinute(match);
}

export function formatLiveBadge(match: Match): string {
  const minute = formatLiveMinute(match);
  if (minute === "Félidő") return "Félidő";
  if (minute) return `Élő · ${minute}`;
  return "Élő";
}

export function formatMatchGoalLabel(goal: MatchGoal): string {
  const suffix = goal.type === "penalty" ? " (büntető)" : "";
  return `${goal.minute} ${goal.playerName}${suffix}`;
}

export function formatMatchTeams(match: Match): string {
  const home = teamLabel(match.homeTeam);
  const away = teamLabel(match.awayTeam);

  if (match.status === "finished" || match.status === "live") {
    return `${home} ${getMatchScoreLabel(match)} ${away}`;
  }

  return `${home} - ${away}`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
