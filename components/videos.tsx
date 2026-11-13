"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Clock3, Eye, MessageCircle, Play, ThumbsUp } from "lucide-react";
import { siteConfig } from "@/lib/config";
import type { VideoFeed, YouTubeVideo } from "@/lib/youtube";
import { SectionEyebrow } from "@/components/section-eyebrow";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function compactCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return n.toLocaleString("en-US");
}

/** Views, likes, and comments; a count the creator hid on YouTube is left out. */
function VideoStats({ video, className = "" }: { video: YouTubeVideo; className?: string }) {
  const items = [
    { key: "views", icon: <Eye size={13}/>, value: video.viewCount, label: "views" },
    { key: "likes", icon: <ThumbsUp size={13}/>, value: video.likeCount, label: "likes" },
    { key: "comments", icon: <MessageCircle size={13}/>, value: video.commentCount, label: "comments" },
  ].filter((item) => item.value !== null && item.value !== undefined);
  if (!items.length) return null;
  return <div className={`video-stats ${className}`}>
    {items.map((item) => <span key={item.key} title={`${item.value!.toLocaleString("en-US")} ${item.label}`} aria-label={`${item.value!.toLocaleString("en-US")} ${item.label}`}>{item.icon}<b>{compactCount(item.value!)}</b></span>)}
  </div>;
}

function VideoThumbnail({ video, priority = false, className = "" }: { video: YouTubeVideo; priority?: boolean; className?: string }) {
  return <div className={`video-thumb ${className}`}>
    <Image src={video.thumbnail} alt={`Thumbnail for ${video.title}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 650px" priority={priority} className="video-thumb-image" />
    {video.duration && <span className="duration-tag"><Clock3 size={11}/>{video.duration}</span>}
  </div>;
}

/** Render the actual YouTube player directly in the featured video area. */
function InlinePlayer({ videoId, title }: { videoId?: string; title: string }) {
  // An uploads playlist lets the site show a playable channel feed even before
  // a YouTube API key is configured. With the API, an explicit video ID always
  // targets the most recent public upload instead.
  const uploadsPlaylist = `UU${siteConfig.youtubeChannelId.slice(2)}`;
  const src = videoId
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?playsinline=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(uploadsPlaylist)}&playsinline=1&rel=0`;

  return <div className="feature-player-wrap">
    <iframe
      key={videoId ?? "channel-uploads"}
      title={title}
      src={src}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </div>;
}

export function Videos({ initialFeed, mode = "featured" }: { initialFeed: VideoFeed; mode?: "featured" | "recent" }) {
  const [feed, setFeed] = useState<VideoFeed>(initialFeed);

  // A page left open will pick up new uploads, not just people visiting afresh.
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/videos", { cache: "no-store" });
        if (!response.ok) return;
        const next: VideoFeed = await response.json();
        // Retain previously loaded videos through temporary API outages.
        if (alive) setFeed((current) => next.status === "ready" || !current.videos.length ? next : current);
      } catch { /* Keep the existing feed. */ }
    };
    const interval = window.setInterval(refresh, 15 * 60 * 1000);
    return () => { alive = false; window.clearInterval(interval); };
  }, []);

  const latest = feed.videos[0];
  const others = feed.videos.slice(1, 4);
  return <>
    {mode === "featured" && <div className="feature-frame" id="latest-video">
      <div className="feature-topline"><span className="red-dot"/><span>THE LATEST DROP</span><span className="feature-topline-right">FROM THE CHANNEL <ArrowUpRight size={14}/></span></div>
      {latest ? <>
        {latest.embeddable
          ? <InlinePlayer videoId={latest.id} title={`Watch latest UnwokeThoughts video: ${latest.title}`} />
          : <a className="feature-image-button" href={latest.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${latest.title} on YouTube (embedding disabled)`}>
              <VideoThumbnail video={latest} priority className="feature-thumb" />
              <span className="feature-play"><Play fill="currentColor" size={24} strokeWidth={1.8} /></span>
            </a>}
        <div className="feature-details">
          <div className="feature-meta"><span>NEWEST UPLOAD</span><span>{dateLabel(latest.publishedAt)}</span></div>
          <h2>{latest.title}</h2>
          <VideoStats video={latest} className="feature-stats" />
          {latest.description && <p>{latest.description.replace(/https?:\/\/\S+/g, "").trim().slice(0, 170)}</p>}
          <div className="feature-actions">
            <a className="feature-watch" href={latest.url} target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={16}/></a>
          </div>
        </div>
      </> : <div className="feature-fallback">
        <InlinePlayer title="Watch the UnwokeThoughts YouTube uploads playlist" />
        <div className="feature-details">
          <div className="feature-meta"><span>LATEST VIDEOS</span><span>YOUTUBE</span></div>
          <h2>Watch the latest on UnwokeThoughts.</h2>
          {/* <p>{feed.status === "not-configured" ? "Play the channel uploads above. Connect the YouTube API key to automatically feature the exact newest public upload with its title, description, and views." : "The YouTube data feed is temporarily unavailable. Play videos in the channel player above or visit YouTube directly."}</p> */}
          <a className="feature-watch" href={siteConfig.youtube} target="_blank" rel="noopener noreferrer">Visit the channel <ArrowUpRight size={16}/></a>
        </div>
      </div>}
    </div>}
    {mode === "recent" && <section id="watch" className="watch-section section-shell">
      <div className="container">
        <SectionEyebrow index="01">THE CHANNEL</SectionEyebrow>
        <div className="section-heading-row">
          <div><p className="section-overline">STAY IN THE LOOP</p><h2>MORE TO <em>WATCH.</em></h2></div>
          <a className="text-arrow-link" href={siteConfig.youtube + "/videos"} target="_blank" rel="noopener noreferrer">All videos <ArrowUpRight size={17}/></a>
        </div>
        {others.length ? <div className="video-grid">{others.map((video, index) => <a key={video.id} href={video.url} className="mini-video-card" target="_blank" rel="noopener noreferrer">
          <div className="mini-thumb-wrap"><VideoThumbnail video={video} /><span className="mini-play"><Play fill="currentColor" size={16}/></span></div>
          <div className="mini-number">0{index + 2} <span>/</span> VIDEO</div>
          <h3>{video.title}</h3>
          <VideoStats video={video} className="mini-stats" />
          <div className="mini-meta"><span>{dateLabel(video.publishedAt)}</span><ArrowUpRight size={17}/></div>
        </a>)}</div> : <div className="video-empty-state">
          <span className="empty-bars" aria-hidden="true"><i/><i/><i/><i/></span>
          <div><h3>More stories. More perspective.</h3><p>Catch the latest uploads, deep dives, and commentary on the YouTube channel.</p></div>
          <a href={siteConfig.youtube + "/videos"} target="_blank" rel="noopener noreferrer">Explore videos <ArrowRight size={17}/></a>
        </div>}
      </div>
    </section>}
  </>;
}
