/** Extract a YouTube video ID from common share / watch / embed URLs. */
export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }

      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

/** Public YouTube thumbnail URL (hqdefault is reliably available). */
export function getYoutubeThumbnailUrl(
  url: string | undefined | null,
  size: "hq" | "max" = "hq",
): string | undefined {
  const videoId = url ? getYoutubeVideoId(url) : null;
  if (!videoId) return undefined;

  const file = size === "max" ? "maxresdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${videoId}/${file}.jpg`;
}

export function isYoutubeThumbnailUrl(url: string | undefined): boolean {
  return Boolean(url?.includes("img.youtube.com/vi/"));
}
