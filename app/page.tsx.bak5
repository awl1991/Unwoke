import { ArrowDown, ArrowRight, ArrowUpRight, HeartHandshake, Mail, Radio, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { BrandMark } from "@/components/brand-mark";
import { BrandIcon } from "@/components/brand-icons";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { Videos } from "@/components/videos";
import { ContactForm } from "@/components/contact-form";
import { BrandStrip } from "@/components/brand-strip";
import { siteConfig } from "@/lib/config";
import { getYoutubeVideos } from "@/lib/youtube";
import { getAudienceStats } from "@/lib/social-stats";
import type { CSSProperties } from "react";

export const revalidate = 900;

export default async function HomePage() {
  const [videos, audience] = await Promise.all([getYoutubeVideos(), getAudienceStats()]);
  const canonical = siteConfig.url;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: canonical,
    email: siteConfig.email,
    description: "Independent news and political commentary from UnwokeThoughts.",
    sameAs: siteConfig.socials.map((social) => social.url),
  };

  return <div id="top" className="site-root">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <div className="announcement-bar"><span className="announcement-square"/><span>UNWOKETHOUGHTS</span><span className="announcement-divider">/</span><span>INDEPENDENT NEWS &amp; POLITICAL COMMENTARY</span><span className="announcement-end">SCROLL TO EXPLORE <ArrowDown size={12}/></span></div>
    <Header />
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-grid-overlay" aria-hidden="true"/>
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="hero-label"><span className="hero-label-number">EST. ONLINE</span><span className="hero-label-line"/><span>THE INDEPENDENT PERSPECTIVE</span></div>
            <h1 id="hero-title">THE NEWS<span className="hero-period">.</span><br/>THE CONTEXT<span className="hero-period">.</span><br/><span className="hero-outline">THE CONVERSATION.</span></h1>
            <p className="hero-subtitle">Independent news. <strong>Unfiltered commentary.</strong><br/>Breaking down the stories shaping America.</p>
            <div className="hero-cta-row">
              <a className="primary-button" href="#connect">EXPLORE PLATFORMS <ArrowRight size={17}/></a>
              <a className="secondary-button" href="#contact"><Mail size={15}/> CONTACT <ArrowRight size={17}/></a>
            </div>
            <div className="hero-signoff"><span className="small-asterisk">✳︎</span><span>YOUR HUB FOR EVERYTHING<br/>UNWOKETHOUGHTS.</span><span className="signoff-rule"/></div>
          </div>
          <div className="hero-feature"><Videos initialFeed={videos}/></div>
        </div>
        <div className="hero-bottom-rule container"><span>BEYOND THE HEADLINES</span><span>↓ &nbsp; KEEP SCROLLING</span></div>
      </section>

      <Videos initialFeed={videos} mode="recent"/>

      <section className="ticker-strip" aria-label="Our focus"><div className="ticker-content"><span>NEWS</span><b>✳︎</b><span>COMMENTARY</span><b>✳︎</b><span>PERSPECTIVE</span><b>✳︎</b><span>CONVERSATION</span><b>✳︎</b><span>UNWOKETHOUGHTS</span></div></section>

      <section id="connect" className="connect-section section-shell">
        <div className="container">
          <SectionEyebrow index="02">STAY CONNECTED</SectionEyebrow>
          <div className="connect-intro">
            <div><p className="section-overline">EVERY PLATFORM. ONE PLACE.</p><h2>FIND US <em>EVERYWHERE.</em></h2></div>
            <p>Different platforms. Same independent voice. Follow along wherever you like to watch, read, and join the conversation.</p>
          </div>
          <div className="social-grid">
            {siteConfig.socials.map((social) => { const stat = audience.platforms.find((p) => p.id === social.id); return <a href={social.url} key={social.id} target="_blank" rel="noopener noreferrer" className={`social-card social-card--${social.id}`} style={{ "--social-accent": social.color } as CSSProperties} aria-label={`Open UnwokeThoughts on ${social.name} (opens in a new tab)`}>
              <div className="social-card-top"><span className="social-icon"><BrandIcon name={social.id} size={26}/></span><ArrowUpRight className="social-arrow" size={19}/></div>
              <div className="social-card-bottom"><span className="social-number">{social.number} / PLATFORM</span><h3>{social.name}</h3><p>{social.description}</p>{stat?.count != null && <span className="social-count"><b title={stat.count.toLocaleString("en-US")}>{new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(stat.count)}</b> {stat.label.toUpperCase()}</span>}<span className="social-handle">{social.handle}</span></div>
            </a>; })}
            <a className="social-card social-card--cta" href={siteConfig.youtube} target="_blank" rel="noopener noreferrer"><span className="social-cta-symbol">✳︎</span><span className="social-cta-middle">DON'T MISS<br/>THE NEXT<br/>STORY.</span><span className="social-cta-foot">SUBSCRIBE ON YOUTUBE <ArrowUpRight size={17}/></span></a>
          </div>
        </div>
      </section>

      <section id="support" className="support-section section-shell">
        <div className="container">
          <SectionEyebrow index="03">BACK THE CHANNEL</SectionEyebrow>
          <div className="support-grid">
            <div className="support-main">
              <span className="support-pretitle"><Radio size={17}/> INDEPENDENT MEDIA MATTERS</span>
              <h2>FUEL THE<br/><em>CONVERSATION.</em></h2>
              <p>Your support helps keep independent news and commentary going. If you enjoy the content, consider becoming a member or showing your support.</p>
              <div className="support-graphic" aria-hidden="true"><span>U<span className="support-symbol-red">/</span>T</span><span className="support-small-ring"/></div>
            </div>
            <div className="support-options">
              <a className="member-card" href={siteConfig.membership} target="_blank" rel="noopener noreferrer">
                <div className="member-top"><span><HeartHandshake size={19}/> THE BEST WAY TO SUPPORT</span><ArrowUpRight size={21}/></div>
                <div><span className="member-kicker">JOIN THE COMMUNITY</span><h3>Become a<br/>YouTube member.</h3><p>Support the channel directly through a YouTube membership.</p></div>
                <span className="member-action">EXPLORE MEMBERSHIP <ArrowRight size={18}/></span>
              </a>
              <div className="support-small-cards">
                <a className="support-small-card" href={siteConfig.cashApp} target="_blank" rel="noopener noreferrer"><span className="support-small-top">DIRECT SUPPORT <ArrowUpRight size={18}/></span><span className="support-small-title">Cash App</span><span className="support-small-sub">$awl1991</span></a>
                <a className="support-small-card" href={siteConfig.venmo} target="_blank" rel="noopener noreferrer"><span className="support-small-top">DIRECT SUPPORT <ArrowUpRight size={18}/></span><span className="support-small-title">Venmo</span><span className="support-small-sub">@labunski</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandStrip />

      <section id="contact" className="contact-section section-shell">
        <div className="container">
          <SectionEyebrow index="04">BUSINESS & PARTNERSHIPS</SectionEyebrow>
          <div className="contact-layout contact-layout--form"><div><span className="contact-prefix"><ShieldCheck size={16}/> OPEN FOR BUSINESS INQUIRIES</span><h2>LET'S MAKE<br/><em>SOMETHING HAPPEN.</em></h2><p>Partnerships, sponsorships, advertising opportunities, and collaborations. Reach out to start a conversation.</p><p className="contact-form-email">Prefer email? <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p></div><ContactForm/></div>
        </div>
      </section>
    </main>
    <footer className="site-footer"><div className="container">
      <div className="footer-top"><div><BrandMark compact/><p>INDEPENDENT NEWS.<br/>UNFILTERED COMMENTARY.</p></div><div className="footer-links"><div><span>EXPLORE</span><a href="#top">Home</a><a href="#watch">Videos</a><a href="#connect">Socials</a></div><div><span>MORE</span><a href="#support">Support</a><a href="#contact">Business</a><a href={siteConfig.youtube} target="_blank" rel="noopener noreferrer">YouTube <ArrowUpRight size={12}/></a></div></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} UNWOKETHOUGHTS. ALL RIGHTS RESERVED.</span><span>INDEPENDENT BY DESIGN. <span className="footer-red-star">✳︎</span></span><a href="https://unwokethoughts.com" rel="canonical">UNWOKETHOUGHTS.COM <ArrowUpRight size={12}/></a></div>
    </div></footer>
  </div>;
}
