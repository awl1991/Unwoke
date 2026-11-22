import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b0e12" };

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "UnwokeThoughts | Independent News & Political Commentary",
  description: "Independent news, unfiltered commentary, and the stories shaping America. Watch the latest from UnwokeThoughts and connect across every platform.",
  alternates: { canonical: "/" },
  applicationName: "UnwokeThoughts",
  openGraph: {
    title: "UnwokeThoughts — Independent News. Unfiltered Commentary.",
    description: "The news. The context. The conversation. Find the latest videos and connect with UnwokeThoughts.",
    url: "/", siteName: "UnwokeThoughts", type: "website", locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "UnwokeThoughts — Independent news and unfiltered commentary" }],
  },
  twitter: { card: "summary_large_image", title: "UnwokeThoughts", description: "Independent news. Unfiltered commentary.", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }], shortcut: "/favicon.ico", apple: "/apple-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
