import type { ReactNode } from "react";

export function SectionEyebrow({ index, children }: { index: string; children: ReactNode }) {
  return <div className="section-eyebrow"><span>{index}</span><span className="eyebrow-line"/><span>{children}</span></div>;
}
