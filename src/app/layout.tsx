import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aura | Minimalist Luxury Architecture",
  description: "Experience the synergy of raw concrete, natural light, and organic minimalist design. A masterpiece of modern architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable} ${bodoni.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
