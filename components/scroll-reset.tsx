"use client";

import { useEffect } from "react";

// 1) On a page refresh, drop any #section from the URL and start at the top.
// 2) In-page links (#contact etc.) scroll so the section sits just below the
//    sticky header. Waits for the mobile menu to close first, so iPhone
//    doesn't overshoot when the header shrinks.
export function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") {
      if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const go = () => {
        const header = document.querySelector(".site-header") as HTMLElement | null;
        const offset = (header?.offsetHeight ?? 0) + 8;
        const top = id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
        history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
      };
      // Let React close the mobile menu, then measure.
      requestAnimationFrame(() => requestAnimationFrame(go));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}