import "server-only";
import { siteConfig } from "@/lib/config";

const API_ROOT = "https://www.googleapis.com/youtube/v3";
const REVALIDATE_SECONDS = 900;

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  duration: string;
  viewCount: number | null;
  embeddable: boolean;
  url: string;
};

export type VideoFeed = {
  status: "ready" | "not-configured" | "unavailable" | "empty";
  videos: YouTubeVideo[];
};

type ChannelResponse = {
  items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
};
type PlaylistResponse = {
  items?: { contentDetails?: { videoId?: string } }[];
};
type VideoResponse = {
  items?: {
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: Record<string, { url?: string }>;
    };
    contentDetails?: { duration?: string };
    statistics?: { viewCount?: string };
    status?: { privacyStatus?: string; embeddable?: boolean };
  }[];
};

async function youtubeRequest<T>(resource: string, params: Record<string, string>, key: string): Promise<T> {
  const url = new URL(`${API_ROOT}/${resource}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set("key", key);

  // This module only runs on the server; the API key is never sent to the browser.
  const response = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`YouTube ${resource} request failed (${response.status})`);
  return (await response.json()) as T;
}

/** Convert an ISO 8601 YouTube duration (PT12M34S) to 12:34. */
function displayDuration(iso: string): string {
  const match = /^P(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return "";
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Three quota-efficient API calls: channels.list -> playlistItems.list -> videos.list.
 * This retrieves actual uploads, not search results; deleted/private videos are filtered.
 */
export async function getYoutubeVideos(): Promise<VideoFeed> {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) return { status: "not-configured", videos: [] };

  try {
    const channel = await youtubeRequest<ChannelResponse>(
      "channels",
      { part: "contentDetails", id: siteConfig.youtubeChannelId },
      key,
    );
    const playlistId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlistId) return { status: "empty", videos: [] };

    const playlist = await youtubeRequest<PlaylistResponse>(
      "playlistItems",
      { part: "contentDetails", playlistId, maxResults: "30" },
      key,
    );
    const ids = [...new Set((playlist.items ?? []).map((item) => item.contentDetails?.videoId).filter((id): id is string => !!id))];
    if (!ids.length) return { status: "empty", videos: [] };

    const details = await youtubeRequest<VideoResponse>(
      "videos",
      { part: "snippet,contentDetails,statistics,status", id: ids.join(",") },
      key,
    );

    const videos = (details.items ?? [])
      .filter((item) => item.snippet?.title && item.snippet?.publishedAt && item.status?.privacyStatus === "public")
      .map((item): YouTubeVideo => {
        const thumbnails = item.snippet?.thumbnails ?? {};
        const thumbnail = thumbnails.maxres?.url ?? thumbnails.standard?.url ?? thumbnails.high?.url ?? thumbnails.medium?.url ?? thumbnails.default?.url ?? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
        const parsedCount = Number(item.statistics?.viewCount);
        return {
          id: item.id,
          title: item.snippet!.title!,
          description: item.snippet?.description ?? "",
          publishedAt: item.snippet!.publishedAt!,
          thumbnail,
          duration: displayDuration(item.contentDetails?.duration ?? ""),
          viewCount: item.statistics?.viewCount != null && Number.isFinite(parsedCount) ? parsedCount : null,
          embeddable: item.status?.embeddable !== false,
          url: `https://www.youtube.com/watch?v=${encodeURIComponent(item.id)}`,
        };
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 4);

    return { status: videos.length ? "ready" : "empty", videos };
  } catch (error) {
    // Never log the requested URL: it contains the private API key.
    console.error("Unable to fetch YouTube uploads:", error instanceof Error ? error.message.replace(/key=[^&\s]+/g, "key=[REDACTED]") : "Unknown error");
    return { status: "unavailable", videos: [] };
  }
}
