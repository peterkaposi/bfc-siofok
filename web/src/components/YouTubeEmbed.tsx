import { getYoutubeVideoId } from "@/lib/youtube";

interface YouTubeEmbedProps {
  url: string;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoId = getYoutubeVideoId(url);

  if (!videoId) {
    return (
      <p className="mt-6 rounded-2xl border border-dashed border-black/15 bg-zinc-50 p-4 text-sm text-black/60">
        Érvénytelen YouTube link: {url}
      </p>
    );
  }

  return (
    <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-black shadow-sm">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube videó"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
