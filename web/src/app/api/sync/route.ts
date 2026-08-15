import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { EREDMENYEK } from "@/lib/constants";
import { refreshTeamData } from "@/lib/flashscore/client";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET nincs beállítva" },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Nincs jogosultság" },
      { status: 401 },
    );
  }

  try {
    revalidateTag(`team-${EREDMENYEK.teamId}`);
    revalidateTag("matches");

    const data = await refreshTeamData();

    return NextResponse.json({
      ok: true,
      syncedAt: new Date().toISOString(),
      teamId: data.teamId,
      matchCount: data.matches.length,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Szinkronizáció sikertelen";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
