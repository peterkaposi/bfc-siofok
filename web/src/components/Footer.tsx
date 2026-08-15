import Link from "next/link";
import { CLUB, EREDMENYEK, SOCIAL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bfc-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold uppercase text-bfc-red">
            {CLUB.shortName}
          </p>
          <p className="mt-2 text-sm text-white/70">{CLUB.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60">
            Hasznos linkek
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={EREDMENYEK.teamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-bfc-red"
              >
                Csapat oldal – Eredmenyek.com
              </a>
            </li>
            <li>
              <a
                href={EREDMENYEK.standingsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-bfc-red"
              >
                Tabella
              </a>
            </li>
            <li>
              <Link href="/studio" className="text-white/80 hover:text-bfc-red">
                Tartalomkezelő (Sanity Studio)
              </Link>
            </li>
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
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-bfc-red"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {CLUB.name}. Minden jog fenntartva.
      </div>
    </footer>
  );
}
