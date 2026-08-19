import Medusa from "@medusajs/js-sdk";
import { MEDUSA_BACKEND_URL } from "./config";

export const medusaSdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});
