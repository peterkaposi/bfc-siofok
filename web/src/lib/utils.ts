import { CLUB, EREDMENYEK } from "@/lib/constants";
import type { Match } from "@/lib/flashscore/types";

const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortDateFormatter = new Intl.DateTimeFormat("hu-HU", {
  month: "short",
  day: "numeric",
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

export function formatMatchDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function formatRelativeDate(date: string): string {
  const target = new Date(date);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) === 0) {
    return `Ma, ${shortDateFormatter.format(target).split(", ").slice(1).join(", ")}`;
  }

  if (diffDays === 1) {
    return `Holnap, ${shortDateFormatter.format(target).split(", ").slice(1).join(", ")}`;
  }

  if (diffDays === -1) {
    return `Tegnap, ${shortDateFormatter.format(target).split(", ").slice(1).join(", ")}`;
  }

  if (diffDays > 1 && diffDays <= 7) {
    return `${diffDays} nap múlva`;
  }

  if (diffDays < -1 && diffDays >= -7) {
    return `${Math.abs(diffDays)} napja`;
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
