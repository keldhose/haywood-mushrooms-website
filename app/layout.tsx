import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Haywood Mushrooms | Premium Mushroom Spawn & Fungal Cultures",
  description:
    "Haywood Mushrooms develops premium mushroom spawn and fungal cultures using scientific plant pathology methods in Cary, North Carolina.",
  openGraph: {
    title: "Haywood Mushrooms",
    description:
      "Premium mushroom spawn and fungal cultures developed using plant pathology expertise.",
    url: "https://www.haywoodmushrooms.com",
    siteName: "Haywood Mushrooms",
    images: [
      {
        url: "/pink-oyster.png",
        width: 1200,
        height: 630,
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

      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Haywood Mushrooms",
              url: "https://www.haywoodmushrooms.com",
              logo: "https://www.haywoodmushrooms.com/logo.png",
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

        {children}

      </body>
    </html>
  );
}