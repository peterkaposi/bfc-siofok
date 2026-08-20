"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CLUB, NAV_ITEMS, SHOP_LINK } from "@/lib/constants";

const LOGO_CANDIDATES = ["/logo.png", "/logo.svg", "/logo.jpg", "/logo.webp"];

function LogoMark() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || candidateIndex >= LOGO_CANDIDATES.length) {
    return (
      <span
        aria-hidden
        className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-bfc-red px-1 text-[10px] font-bold leading-tight text-white sm:h-20 sm:w-20"
      >
        {CLUB.shortName}
      </span>
    );
  }

  return (
    <Image
      src={LOGO_CANDIDATES[candidateIndex]}
      alt={`${CLUB.name} logó`}
      width={80}
      height={80}
      className="h-[4.5rem] w-[4.5rem] shrink-0 object-contain sm:h-20 sm:w-20"
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

function MenuToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      aria-label={isOpen ? "Menü bezárása" : "Menü megnyitása"}
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
    >
      <span className="relative block h-4 w-6">
        <span
          className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
            isOpen ? "top-[7px] rotate-45" : "top-0 rotate-0"
          }`}
        />
        <span
          className={`absolute left-0 top-[7px] block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
            isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
            isOpen ? "top-[7px] -rotate-45" : "top-[14px] rotate-0"
          }`}
        />
      </span>
    </button>
  );
}

function scrollToSection(id: string, headerHeight: number) {
  const target = document.getElementById(id);
  if (!target) return;

  const top =
    target.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeaderHeight = useCallback(() => {
    setHeaderHeight(headerRef.current?.offsetHeight ?? 0);
  }, []);

  useEffect(() => {
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [updateHeaderHeight]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      `${headerHeight}px`,
    );
  }, [headerHeight]);

  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) return;

    const id = window.location.hash.slice(1);
    if (!id || !document.getElementById(id)) return;

    const height = headerRef.current?.offsetHeight ?? headerHeight;

    requestAnimationFrame(() => {
      scrollToSection(id, height);
    });
  }, [pathname, headerHeight]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSectionNav = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) {
      closeMenu();
      return;
    }

    if (pathname !== "/") {
      closeMenu();
      return;
    }

    event.preventDefault();
    const id = href.slice(2);
    const height = headerRef.current?.offsetHeight ?? headerHeight;

    closeMenu();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToSection(id, height);
        window.history.replaceState(null, "", href);
      });
    });
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-bfc-black/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 sm:py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 sm:gap-4"
            onClick={closeMenu}
          >
            <LogoMark />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold uppercase tracking-wide text-white">
                {CLUB.name}
              </p>
              <p className="line-clamp-2 max-w-[11rem] text-[10px] leading-snug text-white/70 sm:max-w-[16rem] sm:text-xs">
                {CLUB.headerSubtitle}
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-6 md:flex">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleSectionNav(event, item.href)}
                  className="text-sm font-medium text-white/80 transition hover:text-bfc-red"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Link
              href={SHOP_LINK.href}
              onClick={closeMenu}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-bfc-red px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700 sm:px-4 sm:text-sm"
            >
              {SHOP_LINK.label}
            </Link>

            <MenuToggle
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            />
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Menü bezárása"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          style={{ top: headerHeight }}
          onClick={closeMenu}
        />
      )}

      <nav
        id="mobile-nav"
        aria-hidden={!isMenuOpen}
        style={{ top: headerHeight }}
        className={`fixed inset-x-0 z-50 max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-b border-white/10 bg-bfc-black/98 transition-[opacity,transform] duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleSectionNav(event, item.href)}
              className="border-b border-white/5 py-3 text-base font-medium text-white/85 transition last:border-b-0 hover:text-bfc-red"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
