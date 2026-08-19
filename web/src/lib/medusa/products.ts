import type { StoreProduct } from "@medusajs/types";
import { medusaSdk } from "./sdk";

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.options";

export async function listShopProducts(
  regionId: string,
): Promise<StoreProduct[]> {
  const { products } = await medusaSdk.store.product.list({
    region_id: regionId,
    fields: PRODUCT_FIELDS,
    limit: 50,
  });

  return products;
}

export async function getProductByHandle(
  handle: string,
  regionId: string,
): Promise<StoreProduct | null> {
  const { products } = await medusaSdk.store.product.list({
    handle,
    region_id: regionId,
    fields: PRODUCT_FIELDS,
    limit: 1,
  });

  return products[0] ?? null;
}

export function getProductThumbnail(product: StoreProduct): string | null {
  return product.thumbnail ?? product.images?.[0]?.url ?? null;
}

export function getLowestVariantPrice(product: StoreProduct) {
  const prices = (product.variants ?? [])
    .map((variant) => variant.calculated_price)
    .filter(Boolean);

  if (!prices.length) return null;

  return prices.reduce((lowest, current) => {
    const currentAmount = current?.calculated_amount ?? Number.MAX_SAFE_INTEGER;
    const lowestAmount = lowest?.calculated_amount ?? Number.MAX_SAFE_INTEGER;
    return currentAmount < lowestAmount ? current : lowest;
  });
}
