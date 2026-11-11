# UnwokeThoughts — Official Website

A custom-built, responsive media-brand website for **https://unwokethoughts.com/**, with real YouTube Data API v3 integration, latest-upload cards, social hub, member support, and business contact.

## Requirements

- Node.js 20.9 or newer (Node 22 recommended)
- A free Google Cloud project with **YouTube Data API v3** enabled
- A Vercel account (recommended) or another Next.js-compatible host

## Run locally

```bash
npm install
cp .env.example .env.local
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

Add your YouTube API key to `.env.local`:

```env
YOUTUBE_API_KEY=YOUR_SECRET_KEY_HERE
```

Then:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

**Without an API key**, the featured area still shows an embedded player for the channel uploads playlist. To guarantee that the featured player specifically targets the newest public video and to show its title, description, and recent-video cards, add the YouTube Data API key.

## Get your YouTube API key

1. Open https://console.cloud.google.com/ and create or select a project.
2. Go to **APIs & Services → Library** and enable **YouTube Data API v3**.
3. Go to **APIs & Services → Credentials → Create credentials → API key**.
4. Restrict the key to **YouTube Data API v3** under API restrictions. The key is used server-side; do not add it as a `NEXT_PUBLIC_` variable or expose it in browser JS.
5. Copy it into `.env.local` for local development. For hosting, add the same variable securely through the host's environment-variable settings.

The channel ID is already configured as `UCEu71gCQHrawoAfjFnU0oJw` (from the channel's current membership link). Update it in `lib/config.ts` if needed.

## Deploy to Vercel

1. Put the project in a GitHub repository (exclude `.env.local` via the included `.gitignore`).
2. In https://vercel.com/ select **Add New → Project**, connect the repository, and select the Next.js framework.
3. Under project **Environment Variables**, add `YOUTUBE_API_KEY` with the key from Google Cloud. Do **not** use `NEXT_PUBLIC_YOUTUBE_API_KEY`.
4. Deploy the website.
5. Under **Project Settings → Domains**, add `unwokethoughts.com` and, optionally, `www.unwokethoughts.com`.
6. Follow the DNS records shown **in your own Vercel project** at your domain registrar. Do not change your existing DNS before the new deployment works correctly.
7. Verify the homepage, latest video, links, and the public `/api/videos` endpoint.

If the domain is currently connected to a different host, you can preview the new site at the temporary Vercel domain before switching DNS.

## YouTube data integration

The website runs three low-quota requests entirely on the server:

- `channels.list` → find the channel's official uploads playlist
- `playlistItems.list` → read the most recent uploaded video IDs
- `videos.list` → get public titles, descriptions, thumbnails, dates, duration, and available view counts

The featured YouTube video is an **inline, 16:9 playable embed directly on the homepage** (not a thumbnail that opens a popup). The server's YouTube requests revalidate approximately every **15 minutes**. A browser left open also requests `/api/videos` every 15 minutes to display newly published uploads. Private/deleted items are not shown. Data can be temporarily stale due to caching, scheduling, and YouTube availability. In any failure or missing-key state, the featured player falls back to the channel uploads playlist without inventing video titles or counts. In that mode, individual latest-video details cannot be guaranteed until the API is configured.

The code lives in `lib/youtube.ts`, `app/api/videos/route.ts`, and `components/videos.tsx`.

## Edit links and wording

**`lib/config.ts`** is the central source of truth for the site name, creator, email, channel ID, YouTube, X, Facebook, Instagram, TikTok, Rumble, Truth Social, Cash App, Venmo, and membership links.

For design changes, edit `app/globals.css`. For page text and layout, edit `app/page.tsx`.

## Project map

```text
app/
  api/videos/route.ts      Public, key-free JSON endpoint for new video metadata
  globals.css              Responsive site design
  layout.tsx               SEO, Open Graph, and metadata
  page.tsx                 Main website
  robots.ts, sitemap.ts    Search-engine basics
components/
  brand-mark.tsx           Custom UT monogram
  brand-icons.tsx          Social-brand SVG icons
  header.tsx               Sticky responsive navigation
  section-eyebrow.tsx      Editorial section labeling
  videos.tsx               Auto-refreshing video features and player
lib/
  config.ts                Edit social/contact links here
  youtube.ts               Secure YouTube Data API logic
public/
  favicon.svg              Custom logo favicon
  og-image.png             Social share preview image
preview.html               Openable visual preview; **not** the API-backed app
```

## Production notes

- All YouTube requests happen on the server; the public endpoint serves only video metadata.
- The latest video plays in an inline privacy-enhanced YouTube iframe (`youtube-nocookie.com`) directly on the homepage, with playback controls and full-screen support. The `Watch on YouTube` link stays available. Videos with embedding disabled link to YouTube instead.
- Social links use `target="_blank"` with `rel="noopener noreferrer"`.
- Responsive layouts and reduced-motion preferences are supported.
- The static `preview.html` includes a channel uploads-playlist iframe, but not API-backed metadata. YouTube may block iframe playback when the preview is opened directly as a `file://` URL due to its Referer requirement; preview on a local web server or deployed site for reliable playback. Run/deploy Next.js and provide the API key for the automatic exact-latest-video feature.

The new project does **not** modify your existing domain or hosting automatically.
