"use client";

import { LIVE_REVALIDATE_SECONDS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface LiveMatchAutoRefreshProps {
  fingerprint: string;
}

export default function LiveMatchAutoRefresh({
  fingerprint,
}: LiveMatchAutoRefreshProps) {
  const router = useRouter();
  const fingerprintRef = useRef(fingerprint);

  useEffect(() => {
    fingerprintRef.current = fingerprint;
  }, [fingerprint]);

  useEffect(() => {
    let stopped = false;

    const tick = async () => {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok || stopped) return;

        const data = (await response.json()) as {
          shouldRefresh?: boolean;
          fingerprint?: string;
        };

        if (!data.shouldRefresh) return;
        if ((data.fingerprint ?? "") === fingerprintRef.current) return;

        router.refresh();
      } catch {
        // The next poll retries. A failed check should not break the page.
      }
    };

    const first = window.setTimeout(tick, 5000);
    const id = window.setInterval(tick, LIVE_REVALIDATE_SECONDS * 1000);
    return () => {
      stopped = true;
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [router]);

  return null;
}
