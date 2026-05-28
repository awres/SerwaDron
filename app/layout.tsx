import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "SerwaDron - Profesjonalne uslugi dronowe",
  description:
    "Profesjonalne ujecia lotnicze dla nieruchomosci, eventow i projektow kreatywnych. Fotografia i filmowanie dronem DJI Mini 3 Pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`bg-background ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
