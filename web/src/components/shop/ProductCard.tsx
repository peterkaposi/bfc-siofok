import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@medusajs/types";
import {
  getLowestVariantPrice,
  getProductThumbnail,
} from "@/lib/medusa/products";
import { formatVariantPrice } from "@/lib/medusa/prices";

interface ProductCardProps {
  product: StoreProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const thumbnail = getProductThumbnail(product);
  const price = formatVariantPrice(getLowestVariantPrice(product));

  return (
    <article className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/shop/products/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] bg-zinc-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-black/40">
              Nincs kép
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="font-display text-lg font-bold text-bfc-black">
            {product.title}
          </h2>
          {price && (
            <p className="mt-2 text-sm font-semibold text-bfc-red">{price}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
