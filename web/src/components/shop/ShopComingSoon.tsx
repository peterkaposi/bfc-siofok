import Link from "next/link";

export default function ShopComingSoon() {
  return (
    <section className="w-full max-w-full bg-zinc-50 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
          Webshop
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase text-bfc-black">
          Webshop hamarosan
        </h1>
        <p className="mt-4 text-lg text-black/70">
          Dolgozunk az online boltunkon. Hamarosan itt vásárolhatsz hivatalos
          BFC Siófok klubtermékeket és mezeket.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-bfc-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Vissza a főoldalra
        </Link>
      </div>
    </section>
  );
}
