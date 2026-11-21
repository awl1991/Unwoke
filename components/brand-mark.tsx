import Image from "next/image";
import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="#top" className={`brand ${compact ? "brand--compact" : ""}`} aria-label="UnwokeThoughts — back to top">
      <span className="brand-symbol" aria-hidden="true">
        <Image src="/logo-mark.png" alt="" width={512} height={512} priority />
      </span>
      <span className="brand-name">UNWOKE<span>THOUGHTS</span></span>
    </Link>
  );
}
