import Link from "next/link";

export default function ShopUnavailable() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bfc-red">
        Webshop
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold uppercase text-bfc-black">
        Hamarosan elérhető
      </h1>
      <p className="mt-4 text-black/70">
        A webshop backend még nincs csatlakoztatva. Indítsd el a Medusa
        szervert, majd add meg a publishable API kulcsot a környezeti
        változókban.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-bfc-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Vissza a főoldalra
      </Link>
    </section>
  );
}
