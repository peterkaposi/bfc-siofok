"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface MobileCardCarouselProps {
  itemCount: number;
  children: ReactNode;
}

export default function MobileCardCarousel({
  itemCount,
  children,
}: MobileCardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(container.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const childCenter = element.offsetLeft + element.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateActiveIndex();
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      container.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, itemCount]);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;

    container.scrollTo({
      left: slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollRef}
        className="players-carousel -mx-4 flex gap-3 overflow-x-auto px-4 pb-2"
      >
        {children}
      </div>

      {itemCount > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: itemCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1}. kártya`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-5 bg-bfc-red"
                  : "w-2 bg-black/20 hover:bg-black/35"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
