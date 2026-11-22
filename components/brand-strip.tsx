import Image from "next/image";

// Add a brand: drop a white, transparent PNG in /public/brands and list it here.
// `url` is where the logo links to (leave "" for no link).
// `height` is the on-screen height in px, so wide and tall logos look balanced.
const brands = [
  { name: "Black Forest", src: "/brands/black-forest.png", width: 299, height: 240, display: 44, url: "https://blackforestsupplements.com/UNWOKETHOUGHTS" },
  { name: "Kalshi", src: "/brands/kalshi.png", width: 920, height: 240, display: 24, url: "https://kalshi.com/r/unwoke" },
  { name: "Chapter", src: "/brands/chapter.png", width: 857, height: 200, display: 27, url: "https://chapter.com/unwoke" },
  { name: "E-Win", src: "/brands/e-win.png", width: 185, height: 53, display: 24, url: "https://www.ewinracing.com" },
];

export function BrandStrip() {
  // Repeat the set so the loop is seamless on wide screens.
  const row = [...brands, ...brands, ...brands];
  return <section id="contact" className="brand-strip" aria-label="Brands we've worked with">
    <div className="container brand-strip-inner">
      <p className="brand-strip-label"><span className="red-dot"/>BRANDS WE&apos;VE WORKED WITH</p>
      <div className="brand-marquee">
        <div className="brand-track">
          {[0, 1].map((copy) => <ul key={copy} className="brand-row" aria-hidden={copy === 1 ? true : undefined}>
            {row.map((brand, i) => {
              const primary = copy === 0 && i < brands.length;
              const logo = <Image src={brand.src} alt={primary ? brand.name : ""} width={brand.width} height={brand.height}
                style={{ height: brand.display, width: "auto" }} />;
              return <li key={`${copy}-${i}`}>
                {brand.url
                  ? <a href={brand.url} target="_blank" rel="noopener noreferrer sponsored" title={`Visit ${brand.name}`} tabIndex={primary ? undefined : -1} aria-hidden={primary ? undefined : true}>{logo}</a>
                  : logo}
              </li>;
            })}
          </ul>)}
        </div>
      </div>
    </div>
  </section>;
}