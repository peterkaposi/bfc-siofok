"use client";

import { LIVE_REVALIDATE_SECONDS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LiveMatchAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const intervalMs = LIVE_REVALIDATE_SECONDS * 1000;
    const id = window.setInterval(() => router.refresh(), intervalMs);
    return () => window.clearInterval(id);
  }, [router]);

  return null;
}
