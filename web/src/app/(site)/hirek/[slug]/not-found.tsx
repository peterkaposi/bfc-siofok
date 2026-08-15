import Link from "next/link";

export default function NewsArticleNotFound() {
  return (
    <div className="bg-white px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase text-bfc-black">
        A hír nem található
      </h1>
      <p className="mt-4 text-black/60">
        Lehet, hogy törölték vagy még nem publikálták.
      </p>
      <Link
        href="/#hirek"
        className="mt-8 inline-flex rounded-full bg-bfc-red px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Vissza a hírekhez
      </Link>
    </div>
  );
}
