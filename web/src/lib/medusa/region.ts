import type { StoreRegion } from "@medusajs/types";
import { medusaSdk } from "./sdk";

export async function getDefaultRegion(): Promise<StoreRegion | null> {
  const { regions } = await medusaSdk.store.region.list();

  if (!regions.length) return null;

  return (
    regions.find((region) =>
      region.countries?.some((country) => country.iso_2 === "hu"),
    ) ?? regions[0]
  );
}
