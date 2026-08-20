import PortableText from "@/components/PortableText";
import type { ClubHistory } from "@/lib/sanity/client";

interface ClubHistorySectionProps {
  history: ClubHistory | null;
}

export default function ClubHistorySection({ history }: ClubHistorySectionProps) {
  return (
    <section id="tortenelem" lang="hu" className="w-full max-w-full bg-zinc-50 py-16">
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
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white p-8 text-black/60">
            <p className="font-medium text-bfc-black">
              A klub története hamarosan megjelenik.
            </p>
            <p className="mt-2 text-sm">
              A tartalom a Sanity CMS „Klub történelem” menüpontjában
              szerkeszthető.
            </p>
          </div>
        ) : (
          <PortableText
            blocks={history.body}
            className="mx-auto mt-10 max-w-3xl [&_p]:hyphens-auto [&_p]:text-justify"
          />
        )}
      </div>
    </section>
  );
}
