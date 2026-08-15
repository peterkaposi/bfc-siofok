import type { ClubHistory, PortableTextBlock } from "@/lib/sanity/client";

interface ClubHistorySectionProps {
  history: ClubHistory | null;
}

function renderBlock(block: PortableTextBlock, index: number) {
  if (block._type !== "block" || !block.children?.length) return null;

  const text = block.children.map((child) => child.text).join("");

  if (!text) return null;

  if (block.style === "h2" || block.style === "h3") {
    return (
      <h3
        key={index}
        className="mt-8 font-display text-2xl font-bold text-bfc-black first:mt-0"
      >
        {text}
      </h3>
    );
  }

  if (block.style === "blockquote") {
    return (
      <blockquote
        key={index}
        className="mt-4 border-l-4 border-bfc-red pl-4 text-lg italic text-black/80"
      >
        {text}
      </blockquote>
    );
  }

  return (
    <p key={index} className="mt-4 text-base leading-7 text-black/75">
      {text}
    </p>
  );
}

export default function ClubHistorySection({ history }: ClubHistorySectionProps) {
  return (
    <section id="tortenelem" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
            Történelem
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase text-bfc-black">
            {history?.title ?? "Klub történelem"}
          </h2>
        </div>

        {!history?.body?.length ? (
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-zinc-50 p-8 text-black/60">
            <p className="font-medium text-bfc-black">
              A klub története hamarosan megjelenik.
            </p>
            <p className="mt-2 text-sm">
              A tartalom a Sanity CMS „Klub történelem” menüpontjában
              szerkeszthető.
            </p>
          </div>
        ) : (
          <div className="prose prose-neutral mt-10 max-w-3xl">
            {history.body.map((block, index) => renderBlock(block, index))}
          </div>
        )}
      </div>
    </section>
  );
}
