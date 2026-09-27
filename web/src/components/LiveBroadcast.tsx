import { getYoutubeVideoId } from "@/lib/youtube";

interface LiveBroadcastProps {
  url: string;
  provider?: string;
}

export default function LiveBroadcast({ url, provider }: LiveBroadcastProps) {
  const videoId = getYoutubeVideoId(url);

  return (
    <div id="elo-kozvetites" className="scroll-mt-24">
      <p className="text-xs uppercase tracking-[0.2em] text-white/60">
        Élő közvetítés
        {provider ? ` · ${provider}` : ""}
      </p>
      {videoId ? (
        <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_0_24px_rgba(220,5,40,0.2)]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="Élő közvetítés"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-bfc-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Élő közvetítés megnyitása
        </a>
      )}
    </div>
  );
}
