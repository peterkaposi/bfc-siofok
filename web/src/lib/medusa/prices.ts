import type { StoreProductVariant } from "@medusajs/types";

interface CalculatedPriceLike {
  calculated_amount?: number | null;
  currency_code?: string | null;
}

export function formatVariantPrice(
  price: CalculatedPriceLike | null | undefined,
): string | null {
  if (!price?.calculated_amount || !price.currency_code) {
    return null;
  }

  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: price.currency_code.toUpperCase(),
  }).format(price.calculated_amount);
}

export function getVariantLabel(variant: StoreProductVariant): string {
  if (variant.title) return variant.title;

  const optionValues = variant.options
    ?.map((option) => option.value)
    .filter(Boolean);

  return optionValues?.length ? optionValues.join(" / ") : variant.id;
}
