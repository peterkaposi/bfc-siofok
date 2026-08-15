import ClubHistorySection from "@/components/ClubHistorySection";
import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import MatchCenter from "@/components/MatchCenter";
import NewsSection from "@/components/NewsSection";
import PlayersSection from "@/components/PlayersSection";
import StandingsSection from "@/components/StandingsSection";
import { getTeamData } from "@/lib/flashscore/client";
import { summarizeTeamData } from "@/lib/flashscore/parser";
import {
  getClubHistory,
  getNewsArticles,
  getPlayers,
  getUpcomingEvents,
} from "@/lib/sanity/client";

export const revalidate = 300;

export default async function HomePage() {
  const [teamData, articles, events, players, history] = await Promise.all([
    getTeamData().catch(() => ({
      teamId: "YFzGWgOR",
      teamName: "BFC Siófok",
      matches: [],
      lastUpdated: new Date().toISOString(),
    })),
    getNewsArticles(),
    getUpcomingEvents(),
    getPlayers(),
    getClubHistory(),
  ]);

  const summary = summarizeTeamData(teamData);

  return (
    <>
      <Hero nextMatch={summary.nextMatch} lastMatch={summary.lastMatch} />
      <MatchCenter
        matches={teamData.matches}
        liveMatches={summary.liveMatches}
      />
      <StandingsSection stats={summary.stats} />
      <PlayersSection players={players} />
      <ClubHistorySection history={history} />
      <NewsSection articles={articles} />
      <EventsSection events={events} />
    </>
  );
}
