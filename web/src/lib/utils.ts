import { CLUB, EREDMENYEK } from "@/lib/constants";
import type { Match } from "@/lib/flashscore/types";

const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("hu-HU", {
  hour: "2-digit",
  minute: "2-digit",
});

const eventDateFormatter = new Intl.DateTimeFormat("hu-HU", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatMatchDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function formatRelativeDate(date: string): string {
  const target = new Date(date);
  const now = new Date();
  const diffDays = Math.round(
    (startOfDay(target).getTime() - startOfDay(now).getTime()) /
      (1000 * 60 * 60 * 24),
  );

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

export function formatEventDate(date: string): string {
  return eventDateFormatter.format(new Date(date));
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
