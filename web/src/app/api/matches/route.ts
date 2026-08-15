import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { EREDMENYEK } from "@/lib/constants";
import { refreshTeamData } from "@/lib/flashscore/client";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await refreshTeamData();

    return NextResponse.json({
      ok: true,
      teamId: data.teamId,
      matchCount: data.matches.length,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ismeretlen hiba történt";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    revalidateTag(`team-${EREDMENYEK.teamId}`);
    revalidateTag("matches");

    const data = await refreshTeamData();

    return NextResponse.json({
      ok: true,
      teamId: data.teamId,
      matchCount: data.matches.length,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ismeretlen hiba történt";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
