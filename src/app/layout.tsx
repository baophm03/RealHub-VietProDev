import { Geist, Newsreader, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const siteUrl = "https://realhub.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RealHub - Nền tảng bất động sản",
  description: "Hệ thống mua bán quản lý bất động sản cho đa người dùng",
  openGraph: {
    title: "RealHub - Nền tảng bất động sản",
    description: "Hệ thống mua bán quản lý bất động sản cho đa người dùng",
    type: "website",
    siteName: "RealHub",
    url: siteUrl,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      vi: `${siteUrl}/vi`,
      en: `${siteUrl}/en`,
      "x-default": `${siteUrl}/vi`,
    },
  },
};

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif-display",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geist.variable} ${newsreader.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
