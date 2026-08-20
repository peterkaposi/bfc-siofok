import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSponsors } from "@/lib/sanity/client";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sponsors = await getSponsors();

  return (
    <>
      <Header />
      <main className="w-full">{children}</main>
      <Footer sponsors={sponsors} />
    </>
  );
}
