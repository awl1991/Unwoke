import { NextResponse } from "next/server";
import { getAudienceStats } from "@/lib/social-stats";

export const revalidate = 3600;

/** Public JSON of current follower counts: /api/stats */
export async function GET() {
  const stats = await getAudienceStats();
  return NextResponse.json(stats, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } });
}
