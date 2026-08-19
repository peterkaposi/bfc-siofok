"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { medusaSdk } from "./sdk";

const CART_COOKIE = "bfc_cart_id";

async function saveCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getOrCreateCart(regionId: string) {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  if (existingCartId) {
    try {
      const { cart } = await medusaSdk.store.cart.retrieve(existingCartId);
      if (cart?.region_id === regionId) {
        return cart;
      }
    } catch {
      // stale cart cookie — create a new cart below
    }
  }

  const { cart } = await medusaSdk.store.cart.create({
    region_id: regionId,
  });

  await saveCartId(cart.id);
  return cart;
}

export async function addVariantToCart(
  regionId: string,
  variantId: string,
  quantity = 1,
) {
  const cart = await getOrCreateCart(regionId);

  const existingLine = cart.items?.find(
    (item) => item.variant_id === variantId,
  );

  if (existingLine) {
    await medusaSdk.store.cart.updateLineItem(cart.id, existingLine.id, {
      quantity: existingLine.quantity + quantity,
    });
  } else {
    await medusaSdk.store.cart.createLineItem(cart.id, {
      variant_id: variantId,
      quantity,
    });
  }

  revalidatePath("/shop/cart");
  revalidatePath("/shop");
}

export async function getCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) return null;

  try {
    const { cart } = await medusaSdk.store.cart.retrieve(cartId, {
      fields: "*items,*items.variant,*items.variant.product",
    });
    return cart;
  } catch {
    return null;
  }
}
