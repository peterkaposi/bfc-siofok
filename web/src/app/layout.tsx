import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Balatonfüredi FC",
    template: "%s | Balatonfüredi FC",
  },
  description:
    "A Balatonfüredi FC hivatalos weboldala – piros-fekete szenvedély a Balaton partján.",
  keywords: [
    "Balatonfüredi FC",
    "BFC",
    "foci",
    "NB III",
    "Balatonfüred",
    "klub",
  ],
  openGraph: {
    title: "Balatonfüredi FC",
    description: "Piros-fekete szenvedély a Balaton partján",
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
