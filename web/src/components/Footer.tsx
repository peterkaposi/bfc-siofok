import { CLUB, DEVELOPER, NAV_ITEMS, SOCIAL } from "@/lib/constants";
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
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60">
            Oldalak
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

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-white/60">
            Írj nekünk
          </p>
          <a
            href={`mailto:${CLUB.email}`}
            className="mt-4 inline-flex items-center gap-3 text-sm text-white/80 transition hover:text-bfc-red"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
            </span>
            <span>{CLUB.email}</span>
          </a>
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
        <p>
          © {new Date().getFullYear()} {CLUB.name}. Minden jog fenntartva.
        </p>
        <p className="mt-1.5">
          Weboldal fejlesztése:{" "}
          <a
            href={DEVELOPER.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 transition hover:text-bfc-red"
          >
            {DEVELOPER.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
