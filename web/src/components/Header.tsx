"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CLUB, SOCIAL } from "@/lib/constants";

const LOGO_CANDIDATES = ["/logo.png", "/logo.svg", "/logo.jpg", "/logo.webp"];

function LogoMark() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || candidateIndex >= LOGO_CANDIDATES.length) {
    return (
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bfc-red text-sm font-bold text-white"
      >
        BFC
      </span>
    );
  }

  return (
    <Image
      src={LOGO_CANDIDATES[candidateIndex]}
      alt={`${CLUB.name} logó`}
      width={44}
      height={44}
      className="h-11 w-11 shrink-0 rounded-full object-cover"
      onError={() => {
        if (candidateIndex < LOGO_CANDIDATES.length - 1) {
          setCandidateIndex((index) => index + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

const navItems = [
  { href: "#meccsek", label: "Meccsek" },
  { href: "#tabella", label: "Tabella" },
  { href: "#jatekosok", label: "Játékosok" },
  { href: "#tortenelem", label: "Klub történelem" },
  { href: "#hirek", label: "Hírek" },
  { href: "#esemenyek", label: "Események" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bfc-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold uppercase tracking-wide text-white">
              {CLUB.shortName}
            </p>
            <p className="truncate text-xs text-white/70">{CLUB.name}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 transition hover:text-bfc-red"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
          >
            FB
          </a>
        </div>
      </div>
    </header>
  );
}
