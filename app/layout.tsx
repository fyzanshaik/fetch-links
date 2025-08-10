import type { Metadata } from "next";
import { Poppins, Lora, Fira_Code } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "YouTube Playlist Link Fetcher",
  description: "Fetch and copy all links (and names) from a YouTube playlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lora.variable} ${firaCode.variable} antialiased`}>
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
      </body>
    </html>
  );
}
