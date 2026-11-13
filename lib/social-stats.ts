import "server-only";
import { siteConfig } from "@/lib/config";

/** How often (seconds) each platform is re-checked. */
const REVALIDATE_SECONDS = 3600;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export type PlatformStat = {
  id: string;
  name: string;
  handle: string;
  url: string;
  color: string;
  label: "Subscribers" | "Followers";
  count: number | null;
  /** "live" = pulled automatically this cycle, "manual" = fallback number from lib/config.ts */
  source: "live" | "manual" | "none";
};

export type AudienceStats = { platforms: PlatformStat[]; total: number; updatedAt: string };

const env = (name: string) => process.env[name]?.trim() || "";
const toNumber = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
};

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function getHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** "4.58K" / "1.2M" / "12,345" -> number */
function parseCompact(text: string): number | null {
  const m = /([\d.,]+)\s*([KMB])?/i.exec(text.trim());
  if (!m) return null;
  const base = Number(m[1].replace(/,/g, ""));
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] || "").toUpperCase() as "K" | "M" | "B"] ?? 1;
  return Number.isFinite(base) ? Math.round(base * mult) : null;
}

const fetchers: Record<string, () => Promise<number | null>> = {
  // YouTube Data API v3 (uses the same YOUTUBE_API_KEY as the video feed).
  async youtube() {
    const key = env("YOUTUBE_API_KEY");
    if (!key) return null;
    const data = await getJson<{ items?: { statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean } }[] }>(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${siteConfig.youtubeChannelId}&key=${key}`,
    );
    const stats = data.items?.[0]?.statistics;
    return stats?.hiddenSubscriberCount ? null : toNumber(stats?.subscriberCount);
  },

  // X API v2 (needs a bearer token from developer.x.com).
  async x() {
    const token = env("X_BEARER_TOKEN");
    if (!token) return null;
    const handle = siteConfig.socials.find((s) => s.id === "x")!.handle.replace("@", "");
    const data = await getJson<{ data?: { public_metrics?: { followers_count?: number } } }>(
      `https://api.x.com/2/users/by/username/${handle}?user.fields=public_metrics`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return toNumber(data.data?.public_metrics?.followers_count);
  },

  // Facebook Graph API (Page ID + a long-lived Page access token).
  async facebook() {
    const id = env("FACEBOOK_PAGE_ID");
    const token = env("FACEBOOK_ACCESS_TOKEN");
    if (!id || !token) return null;
    const data = await getJson<{ followers_count?: number; fan_count?: number }>(
      `https://graph.facebook.com/v21.0/${id}?fields=followers_count,fan_count&access_token=${token}`,
    );
    return toNumber(data.followers_count ?? data.fan_count);
  },

  // Instagram Graph API (Business/Creator account ID + access token).
  async instagram() {
    const id = env("INSTAGRAM_USER_ID");
    const token = env("INSTAGRAM_ACCESS_TOKEN") || env("FACEBOOK_ACCESS_TOKEN");
    if (!id || !token) return null;
    const data = await getJson<{ followers_count?: number }>(
      `https://graph.facebook.com/v21.0/${id}?fields=followers_count&access_token=${token}`,
    );
    return toNumber(data.followers_count);
  },

  // TikTok public profile page (no key needed).
  async tiktok() {
    const handle = siteConfig.socials.find((s) => s.id === "tiktok")!.handle;
    const html = await getHtml(`https://www.tiktok.com/${handle}`);
    const m = /"followerCount":(\d+)/.exec(html);
    return m ? Number(m[1]) : null;
  },

  // Rumble public channel page (best effort; Rumble sometimes blocks servers).
  async rumble() {
    const url = siteConfig.socials.find((s) => s.id === "rumble")!.url;
    const html = await getHtml(url);
    const m = /([\d.,]+\s*[KMB]?)\s*(?:followers|subscribers)/i.exec(html);
    return m ? parseCompact(m[1]) : null;
  },

  // Truth Social public API (best effort; often behind Cloudflare).
  async truth() {
    const handle = siteConfig.socials.find((s) => s.id === "truth")!.handle.replace("@", "");
    const data = await getJson<{ followers_count?: number }>(
      `https://truthsocial.com/api/v1/accounts/lookup?acct=${handle}`,
      { headers: { "User-Agent": UA } },
    );
    return toNumber(data.followers_count);
  },
};

export async function getAudienceStats(): Promise<AudienceStats> {
  const fallback = siteConfig.audienceFallback as Record<string, number | null>;
  const platforms = await Promise.all(
    siteConfig.socials.map(async (social): Promise<PlatformStat> => {
      let count: number | null = null;
      try {
        count = (await fetchers[social.id]?.()) ?? null;
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        console.warn(`Audience stats: ${social.id} unavailable (${msg.replace(/(key|access_token)=[^&\s]+/g, "$1=[REDACTED]")})`);
      }
      const manual = fallback[social.id] ?? null;
      return {
        id: social.id,
        name: social.name,
        handle: social.handle,
        url: social.url,
        color: social.color,
        label: social.id === "youtube" || social.id === "rumble" ? "Subscribers" : "Followers",
        count: count ?? manual,
        source: count != null ? "live" : manual != null ? "manual" : "none",
      };
    }),
  );
  const total = platforms.reduce((sum, p) => sum + (p.count ?? 0), 0);
  return { platforms, total, updatedAt: new Date().toISOString() };
}
