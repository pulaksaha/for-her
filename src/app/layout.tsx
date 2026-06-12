import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import { FilmGrain } from "@/components/cinematic/film-grain";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "For you ♡",
  description: "Something made with love, just for you.",
  // Keep this private — don't index it
  robots: { index: false, follow: false },
  openGraph: {
    title: "For you ♡",
    description: "Something made with love, just for you.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080706",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrument.variable} h-full`}
    >
      <body className="min-h-full bg-verse-void font-sans text-verse-cream antialiased">
        <FilmGrain />
        {children}
      </body>
    </html>
  );
}
