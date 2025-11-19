import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebsiteJsonLd, OrganizationJsonLd, DiscussionForumJsonLd, BreadcrumbJsonLd } from "./components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO最適化されたメタデータ
export const metadata: Metadata = {
  title: "軽貨物掲示板｜全国の案件・求人情報が集まる無料掲示板",
  description: "軽貨物掲示板は、軽貨物ドライバーと荷主・元請けをつなぐ無料掲示板です。案件情報の投稿・閲覧、ドライバー同士の情報交換、リアルタイムでのコミュニケーションが可能。法人・個人ドライバー認証機能で安心してご利用いただけます。",
  keywords: ["軽貨物", "掲示板", "案件", "求人", "ドライバー", "配送", "運送", "荷主", "元請け", "軽貨物運送", "軽トラック", "軽バン"],
  authors: [{ name: "軽貨物掲示板" }],
  creator: "軽貨物掲示板",
  publisher: "軽貨物掲示板",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://keikamotukeijiban.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "軽貨物掲示板｜全国の案件・求人情報が集まる無料掲示板",
    description: "軽貨物ドライバーと荷主・元請けをつなぐ無料掲示板。案件情報の投稿・閲覧、情報交換、認証機能で安心してご利用いただけます。",
    url: '/',
    siteName: "軽貨物掲示板",
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '軽貨物掲示板 - 案件・求人情報',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "軽貨物掲示板｜全国の案件・求人情報が集まる無料掲示板",
    description: "軽貨物ドライバーと荷主・元請けをつなぐ無料掲示板。案件情報の投稿・閲覧、情報交換が可能。",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification（必要に応じて設定）
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* SEO: 構造化データ（JSON-LD） - UI/UX変更なし */}
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <DiscussionForumJsonLd />
        <BreadcrumbJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
