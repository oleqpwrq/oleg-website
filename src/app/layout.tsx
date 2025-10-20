// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Rubik } from "next/font/google";

// Inter — базовый текст, Rubik — для имени (кириллица включена)
const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const rubik = Rubik({
  subsets: ["cyrillic", "latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Олег Прокуронов — Сайт-визитка",
  icons: [
    { rel: "icon", url: "/favicon.ico" }, // public/favicon.ico
    { rel: "apple-touch-icon", url: "/icon.png" }, // app/icon.png (512×512) — опционально
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.className} ${rubik.variable}`}>
      {/* Доп. мета можно добавлять через export const metadata выше */}
      <body
        style={{
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        {children}
      </body>
    </html>
  );
}
