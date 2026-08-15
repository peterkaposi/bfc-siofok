import { unstable_cache } from "next/cache";
import { EREDMENYEK, REVALIDATE_SECONDS } from "@/lib/constants";
import { parseFlashscoreHtml } from "./parser";
import type { TeamData } from "./types";

async function fetchTeamHtml(): Promise<string> {
  const response = await fetch(EREDMENYEK.teamUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; BFC-Website/1.0; +https://balatonfuredifc.hu)",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "hu-HU,hu;q=0.9",
    },
    next: { revalidate: REVALIDATE_SECONDS },
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
  const html = await fetchTeamHtml();
  return parseFlashscoreHtml(html, EREDMENYEK.teamId);
}
