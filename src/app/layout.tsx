// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // если у тебя есть общий css (можно пустой)
import { Inter, Rubik } from "next/font/google";

// Inter — базовый текст, Rubik — для имени в хедере
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.className} ${rubik.variable}`}>
      <body style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      }}>
        {children}
      </body>
    </html>
  );
}
