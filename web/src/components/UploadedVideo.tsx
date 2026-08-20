interface UploadedVideoProps {
  src: string;
  mimeType?: string;
  caption?: string;
}

export default function UploadedVideo({
  src,
  mimeType,
  caption,
}: UploadedVideoProps) {
  return (
    <figure className="mt-6">
      <video
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full rounded-2xl bg-black shadow-sm"
      >
        <source src={src} type={mimeType ?? undefined} />
        A böngésződ nem támogatja a videólejátszást.
      </video>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-black/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
