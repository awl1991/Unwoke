/** All external URLs and brand content are editable here. */
export const siteConfig = {
  name: "UnwokeThoughts",
  creator: "Andrew Labunski",
  url: "https://unwokethoughts.com",
  email: "unwoke1.0@gmail.com",
  youtubeChannelId: "UCEu71gCQHrawoAfjFnU0oJw",
  youtube: "https://www.youtube.com/@unwokethoughts",
  membership: "https://www.youtube.com/channel/UCEu71gCQHrawoAfjFnU0oJw/join",
  cashApp: "https://cash.app/$awl1991",
  venmo: "https://venmo.com/u/labunski",
  /**
   * Backup follower counts, shown when a platform can't be read automatically.
   * Set a number (e.g. 12500) or null to show a "Follow" card instead.
   */
  audienceFallback: {
    youtube: null,
    x: 2730,
    facebook: 145000,
    instagram: null,
    tiktok: null,
    rumble: 461,
    truth: 79,
  },
  socials: [
    {
      id: "youtube", name: "YouTube", handle: "@unwokethoughts",
      description: "Videos & commentary", url: "https://www.youtube.com/@unwokethoughts",
      color: "#FF0033", number: "01",
    },
    {
      id: "x", name: "X / Twitter", handle: "@unwokethoughts",
      description: "News & daily takes", url: "https://twitter.com/unwokethoughts",
      color: "#FFFFFF", number: "02",
    },
    {
      id: "facebook", name: "Facebook", handle: "UnwokeThoughts",
      description: "Posts & conversations", url: "https://www.facebook.com/unwokethoughts",
      color: "#438AFF", number: "03",
    },
    {
      id: "instagram", name: "Instagram", handle: "@unwoke.thoughts",
      description: "Clips & highlights", url: "https://www.instagram.com/unwoke.thoughts/",
      color: "#F777A9", number: "04",
    },
    {
      id: "tiktok", name: "TikTok", handle: "@unwoke_thoughts",
      description: "Short-form videos", url: "https://www.tiktok.com/@unwoke_thoughts",
      color: "#65EEE9", number: "05",
    },
    {
      id: "rumble", name: "Rumble", handle: "UnwokeThoughts",
      description: "Watch on Rumble", url: "https://rumble.com/user/UnwokeThoughts",
      color: "#8ACB49", number: "06",
    },
    {
      id: "truth", name: "Truth Social", handle: "@unwokethoughts",
      description: "Follow the updates", url: "https://truthsocial.com/@unwokethoughts",
      color: "#5FBAEA", number: "07",
    },
  ],
} as const;
