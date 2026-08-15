import ClubHistorySection from "@/components/ClubHistorySection";
import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import MatchCenter from "@/components/MatchCenter";
import NewsSection from "@/components/NewsSection";
import PlayersSection from "@/components/PlayersSection";
import StandingsSection from "@/components/StandingsSection";
import { getTeamData, reconcileTeamData, refreshTeamData } from "@/lib/flashscore/client";
import { hasMatchInLiveWindow, shouldPollLiveMatches, summarizeTeamData } from "@/lib/flashscore/parser";
import {
  getClubHistory,
  getNewsArticles,
  getPlayers,
  getUpcomingEvents,
} from "@/lib/sanity/client";
import LiveMatchAutoRefresh from "@/components/LiveMatchAutoRefresh";

export const revalidate = 300;

export default async function HomePage() {
  let teamData = await getTeamData().catch(() => ({
    teamId: "YFzGWgOR",
    teamName: "BFC Siófok",
    matches: [],
    lastUpdated: new Date().toISOString(),
  }));

  let summary = summarizeTeamData(teamData);
  const inLiveWindow = hasMatchInLiveWindow(teamData.matches);

  if (summary.liveMatches.length > 0 || inLiveWindow) {
    teamData = await refreshTeamData().catch(() => teamData);
    teamData = await reconcileTeamData(teamData);
    summary = summarizeTeamData(teamData);
  }

  const liveMatches = summary.liveMatches;
  const liveMatch = liveMatches[0];

  const [articles, events, players, history] = await Promise.all([
    getNewsArticles(),
    getUpcomingEvents(),
    getPlayers(),
    getClubHistory(),
  ]);

  return (
    <>
      {shouldPollLiveMatches(teamData.matches) && <LiveMatchAutoRefresh />}
      <Hero
        nextMatch={summary.nextMatch}
        lastMatch={summary.lastMatch}
        liveMatch={liveMatch}
      />
      <MatchCenter
        matches={teamData.matches}
        liveMatches={liveMatches}
      />
      <StandingsSection stats={summary.stats} />
      <PlayersSection players={players} />
      <ClubHistorySection history={history} />
      <NewsSection articles={articles} />
      <EventsSection events={events} />
    </>
  );
}
