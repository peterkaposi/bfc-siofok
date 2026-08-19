"use client";

import type { StoreProductVariant } from "@medusajs/types";
import { useState, useTransition } from "react";
import { addVariantToCart } from "@/lib/medusa/cart";
import { formatVariantPrice, getVariantLabel } from "@/lib/medusa/prices";

interface AddToCartFormProps {
  regionId: string;
  variants: StoreProductVariant[];
}

export default function AddToCartForm({
  regionId,
  variants,
}: AddToCartFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedVariant?.id) return;

    startTransition(async () => {
      try {
        await addVariantToCart(regionId, selectedVariant.id, 1);
        setMessage("Kosárba téve!");
      } catch {
        setMessage("Nem sikerült kosárba tenni. Próbáld újra.");
      }
    });
  };

  if (!variants.length) {
    return (
      <p className="text-sm text-black/60">Jelenleg nem elérhető készleten.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-black/70">
        Méret / variáns
        <select
          value={selectedVariantId}
          onChange={(event) => setSelectedVariantId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {getVariantLabel(variant)}
              {variant.calculated_price
                ? ` — ${formatVariantPrice(variant.calculated_price)}`
                : ""}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-bfc-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {isPending ? "Kosárba..." : "Kosárba teszem"}
      </button>

      {message && <p className="text-sm text-black/70">{message}</p>}
    </form>
  );
}
