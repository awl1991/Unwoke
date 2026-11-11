import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="#top" className={`brand ${compact ? "brand--compact" : ""}`} aria-label="UnwokeThoughts — back to top">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 42 42" fill="none" role="presentation">
          <path d="M6 7V22C6 30.5 12.7 36 21 36C29.3 36 36 30.5 36 22V7H28V22C28 26 25.1 28.5 21 28.5C16.9 28.5 14 26 14 22V7H6Z" fill="currentColor" />
          <path d="M19 7H25V23H19V7Z" fill="#F04F4F" />
        </svg>
      </span>
      <span className="brand-name">UNWOKE<span>THOUGHTS</span></span>
    </Link>
  );
}
