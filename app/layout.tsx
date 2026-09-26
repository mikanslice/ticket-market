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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ticket-market.mikanslice.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ticket Market",
  description: "変動するチケット価格を読み、売上を最大化しよう",
  keywords: [
    "チケットマーケット",
    "チケット価格シミュレーター",
    "チケット市場",
    "価格変動ゲーム",
    "チケット販売シミュレーション",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ticket Market",
    description: "変動するチケット価格を読み、売上を最大化しよう",
    type: "website",
    locale: "ja_JP",
    siteName: "Ticket Market",
    url: "/",
    images: [
      {
        url: "/ogp.png",
        width: 2048,
        height: 2048,
        alt: "Ticket Market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticket Market",
    description: "変動するチケット価格を読み、売上を最大化しよう",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
