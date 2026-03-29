import type { Metadata, Viewport } from "next";
import { Archivo, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-display-fallback",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Alexander | Motion & Web 3D",
  description:
    "Личный landing page Александра с мягкой Material You эстетикой, web 3D сценой и scroll-driven motion.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7fbff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${nunito.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
