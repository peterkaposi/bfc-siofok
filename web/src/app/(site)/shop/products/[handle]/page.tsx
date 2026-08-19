import ShopComingSoon from "@/components/shop/ShopComingSoon";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;

  return {
    title: `${handle} | Webshop | BFC Siófok`,
  };
}

export default function ProductPage() {
  return <ShopComingSoon />;
}
