import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="bg-white px-4 py-24 text-center text-bfc-black sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase">
        Az esemény nem található
      </h1>
      <p className="mt-4 text-black/60">
        Lehet, hogy törölték vagy még nem publikálták.
      </p>
      <Link
        href="/#esemenyek"
        className="mt-8 inline-flex rounded-full bg-bfc-red px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Vissza az eseményekhez
      </Link>
    </div>
  );
}
