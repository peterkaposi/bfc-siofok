import { CLUB, NAV_ITEMS, SOCIAL } from "@/lib/constants";
import type { Sponsor } from "@/lib/sanity/client";

interface FooterProps {
  sponsors: Sponsor[];
}

export default function Footer({ sponsors }: FooterProps) {
  return (
    <footer className="w-full max-w-full border-t border-white/10 bg-bfc-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold uppercase text-bfc-red">
            {CLUB.name}
          </p>
          <p className="mt-2 text-sm text-white/70">{CLUB.tagline}</p>
          <a
            href={`mailto:${CLUB.email}`}
            className="mt-3 inline-block text-sm text-white/80 transition hover:text-bfc-red"
          >
            {CLUB.email}
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60">
            Oldal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-white/80 hover:text-bfc-red">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60">
            Kövess minket
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-bfc-red"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-bfc-red"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-bfc-red"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div id="szponzorok" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-white/60">
            Szponzorok
          </p>

          {sponsors.length === 0 ? (
            <p className="mt-6 text-center text-sm text-white/50">
              A Szponzorok a Sanity CMS-ben adhatók hozzá (név és logó).
            </p>
          ) : (
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {sponsors.map((sponsor) => {
                const content = (
                  <>
                    {sponsor.logoUrl ? (
                      <div className="flex h-24 min-w-[140px] items-center justify-center px-4 py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="max-h-16 max-w-[200px] object-contain opacity-90 transition hover:opacity-100"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-white/80">
                        {sponsor.name}
                      </span>
                    )}
                  </>
                );

                return (
                  <li key={sponsor._id}>
                    {sponsor.url ? (
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={sponsor.name}
                        className="block"
                      >
                        {content}
                      </a>
                    ) : (
                      <div title={sponsor.name}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div
        className="border-t border-white/10 py-4 text-center text-xs text-white/50"
        suppressHydrationWarning
      >
        © {new Date().getFullYear()} {CLUB.name}. Minden jog fenntartva.
      </div>
    </footer>
  );
}
