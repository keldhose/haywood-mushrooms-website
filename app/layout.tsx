import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingCartButton from "./components/FloatingCartButton";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.haywoodmushrooms.com"),
  title: "Haywood Mushrooms — Spawn Laboratory",
  description:
    "Science-led mushroom spawn, grown from science not guesswork. Order premium grain spawn directly from our lab in North Carolina.",
  openGraph: {
    title: "Haywood Mushrooms — Spawn Laboratory",
    description:
      "Science-led mushroom spawn, grown from science not guesswork. Order premium grain spawn directly from our lab in North Carolina.",
    url: "https://www.haywoodmushrooms.com",
    siteName: "Haywood Mushrooms",
    images: [
      {
        url: "/pink-oyster.png",
        width: 1600,
        height: 1200,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${hankenGrotesk.variable} ${ibmPlexMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Haywood Mushrooms",
              url: "https://www.haywoodmushrooms.com",
              logo: "https://www.haywoodmushrooms.com/haywood-logo-primary.png",
              description:
                "Haywood Mushrooms develops mushroom spawn and fungal cultures using scientific plant pathology methods.",
              founder: {
                "@type": "Person",
                name: "Dr. Anna Thomas"
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Cary",
                addressRegion: "NC",
                addressCountry: "US"
              },
              areaServed: "United States"
            }),
          }}
        />

        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
