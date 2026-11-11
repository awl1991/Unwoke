"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/lib/config";

const nav = [
  { label: "Home", href: "#top" },
  { label: "Watch", href: "#watch" },
  { label: "Follow", href: "#connect" },
  { label: "Support", href: "#support" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandMark />
        <nav aria-label="Main navigation" className="desktop-nav">
          {nav.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-subscribe" href={siteConfig.youtube} target="_blank" rel="noopener noreferrer">
          Subscribe <ArrowUpRight size={15} strokeWidth={2.1} />
        </a>
        <button type="button" className="mobile-menu-button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {mobileOpen && <nav id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav">
        {nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}<ArrowUpRight size={15}/></a>)}
        <a href={siteConfig.youtube} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>Subscribe on YouTube <ArrowUpRight size={15}/></a>
      </nav>}
    </header>
  );
}
