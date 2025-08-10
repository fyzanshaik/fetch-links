import type { Metadata } from "next";
import { Poppins, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "YouTube Playlist Link Fetcher",
  description: "Fetch and copy all links (and names) from a YouTube playlist.",
  keywords: [
    "YouTube",
    "playlist",
    "links",
    "extract",
    "copy",
    "download",
    "JSON",
  ],
  applicationName: "YouTube Playlist Link Fetcher",
  authors: [{ name: "fyzanshaik", url: "https://github.com/fyzanshaik" }],
  creator: "fyzanshaik",
  publisher: "fyzanshaik",
  openGraph: {
    title: "YouTube Playlist Link Fetcher",
    description: "Paste a YouTube playlist URL and copy all video links (and names) in one click.",
    url: "https://fetch-links.example.com/",
    siteName: "Playlist Links",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Playlist Link Fetcher",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@fyzanshaik",
    creator: "@fyzanshaik",
    title: "YouTube Playlist Link Fetcher",
    description: "Paste a YouTube playlist URL and copy all video links (and names) in one click.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${poppins.variable} ${inter.variable} ${spaceMono.variable} antialiased`}>
        <div className="min-h-dvh flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="w-full border-t border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-center text-xs text-muted-foreground py-4 px-4">
            Made by
            {' '}
            <a className="text-primary hover:underline" href="https://github.com/fyzanshaik" target="_blank" rel="noreferrer">
              @fyzanshaik
            </a>
            {' '}·{' '}
            <a className="text-primary hover:underline" href="https://twitter.com/fyzanshaik" target="_blank" rel="noreferrer">
              Twitter
            </a>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
