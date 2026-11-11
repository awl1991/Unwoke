import { NextResponse } from "next/server";
import { getYoutubeVideos } from "@/lib/youtube";

// Pollable public endpoint. It returns only public video metadata, NEVER an API key.
export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getYoutubeVideos();
  return NextResponse.json(feed, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=900" },
  });
}
