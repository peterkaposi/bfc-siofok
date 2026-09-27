import { NextResponse } from "next/server";
import {
  getTeamData,
  reconcileTeamData,
  refreshTeamData,
} from "@/lib/flashscore/client";
import {
  liveSnapshotKey,
  shouldPollLiveMatches,
} from "@/lib/flashscore/parser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = await getTeamData();

    if (!shouldPollLiveMatches(cached.matches)) {
      return NextResponse.json({
        shouldRefresh: false,
        fingerprint: liveSnapshotKey(cached.matches),
      });
    }

    const fresh = await reconcileTeamData(await refreshTeamData());

    return NextResponse.json({
      shouldRefresh: true,
      fingerprint: liveSnapshotKey(fresh.matches),
    });
  } catch {
    return NextResponse.json({ shouldRefresh: false, fingerprint: "" });
  }
}
